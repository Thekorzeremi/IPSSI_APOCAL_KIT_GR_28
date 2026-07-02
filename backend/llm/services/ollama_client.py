"""
Client Ollama — appel HTTP vers le service LLM LOCAL (gratuit).

[Note pédagogique] Ollama fait tourner un modèle open-source (Llama, Phi,
Mistral…) en local, sans clé API ni coût. C'est le backend par DÉFAUT du kit :
souveraineté des données + zéro coût. Sa contrepartie est la latence sur CPU
(cf. perturbation J2). Le prompt et la validation sont mutualisés dans
quiz_prompt.py et partagés avec les clients OpenAI / Claude.
"""

import logging

import requests
from django.conf import settings

logger = logging.getLogger(__name__)

from .base import LLMClient, LLMError
from .quiz_prompt import SYSTEM_PROMPT, build_user_prompt, parse_and_validate_quiz


class OllamaLLMClient(LLMClient):
    """Client HTTP minimal pour Ollama (/api/generate)."""

    def __init__(
        self, *, model: str | None = None, host: str | None = None, timeout: int | None = None
    ) -> None:
        # Overrides éventuels (config admin en base, Lot 8) sinon valeurs .env.
        self.host = (host or settings.OLLAMA_HOST).rstrip("/")
        self.model = model or settings.OLLAMA_MODEL
        # Configurable via OLLAMA_TIMEOUT (.env). Défaut 600 s : une génération
        # 8B sur CPU peut dépasser largement 120 s (cf. perturbation J2 latence).
        self.timeout = timeout or settings.OLLAMA_TIMEOUT

    MAX_ATTEMPTS = 3  # 1 essai initial + 2 relances si la validation échoue

    def generate_quiz(self, source_text: str, title: str) -> list[dict]:
        # Séparation explicite system/user + retry sur échec de validation.
        # Si le LLM renvoie un JSON invalide ou suspect (injection détectée),
        # on relance jusqu'à MAX_ATTEMPTS avant de remonter l'erreur.
        user_prompt = build_user_prompt(source_text, title)
        last_error: LLMError | None = None
        for attempt in range(1, self.MAX_ATTEMPTS + 1):
            try:
                raw = self._call_ollama(user_prompt)
                return parse_and_validate_quiz(raw)
            except LLMError as exc:
                last_error = exc
                logger.warning("Tentative %d/%d échouée : %s", attempt, self.MAX_ATTEMPTS, exc)
        raise LLMError(f"Échec après {self.MAX_ATTEMPTS} tentatives. Dernière erreur : {last_error}") from last_error

    # ----- internals -----

    def _call_ollama(self, user_prompt: str) -> str:
        try:
            response = requests.post(
                f"{self.host}/api/generate",
                json={
                    "model": self.model,
                    "system": SYSTEM_PROMPT,   # instructions système isolées du contenu
                    "prompt": user_prompt,      # contenu utilisateur (cours)
                    "stream": False,
                    "options": {"temperature": 0.4},  # peu de créativité : on veut du factuel
                    "format": "json",  # mode JSON strict d'Ollama si supporté
                },
                timeout=self.timeout,
            )
            response.raise_for_status()
        except requests.RequestException as exc:
            raise LLMError(f"Ollama injoignable : {exc}") from exc

        data = response.json()
        raw = data.get("response", "")
        if not raw:
            raise LLMError("Ollama a renvoyé une réponse vide.")
        return raw
