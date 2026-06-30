# Benchmark — Mistral 7B Instruct

**Auteur :** Rémi Korzeniowski  
**Date :** 2026-06-30  
**Outil :** Ollama v0.30.11  
**OS :** Fedora (Linux 7.0.12)  
**Cas d'usage :** Génération de QCM JSON strict depuis un texte de cours (3 questions, 4 options, `correct_index` 0-based)

---

## 1. Environnement de test

| Composant | Valeur |
|---|---|
| Machine | ThinkPad L480 (`L480LXRK`) |
| CPU | Intel Core i5-8250U — 8 cœurs |
| RAM | 15 Gi totale — ~7.8 Gi disponible pendant les tests |
| GPU | **Aucun GPU dédié** — Intel UHD 620 intégré (CPU-only) |
| Disque | 35 Go libres sur 236 Go |
| Modèle téléchargé | `mistral:7b-instruct` — **4.4 GB** (quantifié Q4) |

---

## 2. Résultats de performance (vitesse)

**Méthodologie :** 5 runs consécutifs, modèle déjà chargé (warm), prompt identique (génération de 3 questions QCM), mesure via `eval_duration` de l'API Ollama.

| Run | Eval (ms) | Tokens générés | Tokens/s |
|-----|-----------|----------------|----------|
| 1   | 85 317    | 232            | 2.7      |
| 2   | 99 022    | 263            | 2.7      |
| 3   | 83 253    | 227            | 2.7      |
| 4   | 75 150    | 200            | 2.7      |
| 5   | 81 260    | 234            | 2.9      |

| Métrique | Valeur |
|---|---|
| **Médiane** | **83 253 ms (83.3s)** |
| **P95** | **85 317 ms (85.3s)** |
| Moyenne | 84 800 ms (84.8s) |
| Min | 75 150 ms (75.2s) |
| Max | 99 022 ms (99.0s) |
| Vitesse moyenne | ~2.7 tokens/s |

> **Note :** Ces mesures sont en mode **CPU-only**. Avec un GPU dédié (8 GB+ VRAM), la vitesse serait typiquement 10–30× plus élevée (~30–80 tokens/s).

---

## 3. Qualité des réponses

**Protocole :** chaque run a été audité selon 4 critères. Note globale : `/5`.

| Critère | Détail | Score |
|---|---|---|
| **JSON valide** | Le modèle retourne du JSON parseable | 5/5 runs ✓ |
| **Structure respectée** | Clés `prompt`, `options`, `correct_index` présentes | 5/5 runs ✓ |
| **`correct_index` valide (0-based)** | L'index est dans `[0, 3]` | 3/5 runs ✓ — **2/5 runs génèrent `correct_index: 4`** (off-by-one, index 1-based) |
| **Pertinence des questions** | Questions cohérentes avec le cours fourni | 5/5 runs ✓ |

### Problème identifié : off-by-one sur `correct_index`

Dans 2 runs sur 5, le modèle a généré `"correct_index": 4` pour une question avec 4 options (indices valides : 0–3). La réponse correcte était la 4ème option — le modèle a utilisé un comptage 1-based au lieu de 0-based.

**Impact applicatif :** ce bug est attrapé par `parse_and_validate_quiz()` dans `quiz_prompt.py` (validation `0 <= correct_index < 4`), mais la question est alors rejetée, dégradant la réponse ou forçant un retry.

**Note qualité globale : 3/5**

| Note | Justification |
|---|---|
| ✅ JSON toujours valide | Le modèle suit le format JSON demandé dans 100% des cas |
| ✅ Questions pertinentes | Le contenu des questions est cohérent avec le cours fourni |
| ⚠️ Erreur `correct_index` | 40% des runs ont au moins un index hors limite (erreur récurrente) |
| ➡️ 3/5 | Utilisable avec validation stricte côté applicatif, mais pas fiable sans elle |

---

## 4. Spécifications officielles Mistral 7B Instruct

Source : [Mistral AI documentation](https://mistral.ai) + Ollama model card

| Spec | Valeur |
|---|---|
| Paramètres | 7.3 milliards |
| Taille disque (Q4 Ollama) | **4.4 GB** |
| RAM recommandée (CPU-only) | **8 GB minimum, 16 GB recommandé** |
| VRAM recommandée (GPU) | **8 GB minimum** (ex : RTX 3080, RTX 4070) |
| GPU recommandé | RTX 3080 / RTX 4070 / A10G ou équivalent |
| Contexte max | 32 768 tokens (v0.3) |
| Langue principale | Anglais (mais supporte le français) |
| Licence | Apache 2.0 |
| Vitesse attendue CPU | 2–5 tokens/s (selon CPU) |
| Vitesse attendue GPU (8B VRAM) | 30–80 tokens/s |

---

## 5. Avantages / Inconvénients

### Avantages

- **JSON toujours valide** — excellent suivi des instructions de format structuré
- **Licence Apache 2.0** — libre d'usage commercial et de modification
- **Taille raisonnable** — 4.4 GB, tient sur la plupart des machines
- **Multilingue fonctionnel** — le français est supporté sans dégradation notable
- **Contexte 32k tokens** — adapté aux cours longs
- **Disponible en local** — souveraineté des données, 0 coût d'API

### Inconvénients

- **Très lent sans GPU** — ~83s pour 3 questions sur CPU, inutilisable en production sans GPU dédié
- **Erreur `correct_index` récurrente (40%)** — confusion 0-based vs 1-based, nécessite validation stricte obligatoire
- **Pas de GPU dans l'env de test** — impossible de mesurer les perf GPU réelles localement
- **Questions parfois trop similaires** — les runs 2, 3, 4 génèrent des questions très proches entre elles (paraphrase du cours sans reformulation pédagogique)

---

## 6. Résumé pour le tableau comparatif équipe

| Critère | Mistral 7B Instruct | Notes |
|---|---|---|
| **Vitesse (médiane)** | 83 253 ms (CPU) | Env. de test sans GPU |
| **Vitesse (P95)** | 85 317 ms (CPU) | |
| **Tokens/s** | ~2.7 t/s (CPU) | ~30–80 t/s GPU attendu |
| **Qualité** | 3/5 | Bug correct_index 40% du temps |
| **RAM recommandée** | 8–16 GB | |
| **Taille disque** | 4.4 GB | |
| **GPU recommandé** | 8 GB VRAM min | RTX 3080 / RTX 4070 |
| **Licence** | Apache 2.0 | |
| **JSON strict** | Oui (100%) | |
| **Erreur connue** | `correct_index` off-by-one | 40% des runs |

