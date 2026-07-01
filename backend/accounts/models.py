"""
Modèles de l'app accounts.

[Note pédagogique] On garde le modèle User standard de Django (simple et
robuste), et on lui ajoute un Profil 1-pour-1 pour les infos métier qui ne sont
pas dans User — ici `email_verified` (l'utilisateur a-t-il cliqué le lien de
confirmation envoyé par email ?).

Choix d'architecture « email = identifiant » : à l'inscription, on met
username = email (voir SignupSerializer). Le login se fait donc par email, sans
backend d'authentification custom. C'est le compromis le plus simple pour un
kit pédagogique (un vrai produit utiliserait souvent un User personnalisé avec
USERNAME_FIELD = 'email').
"""

import hashlib

from django.conf import settings
from django.db import models
from django.utils import timezone


class Profile(models.Model):
    """Informations complémentaires attachées à un utilisateur."""

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="profile",
    )
    # Validation "soft" : le compte fonctionne même si l'email n'est pas vérifié,
    # mais un bandeau invite l'utilisateur à cliquer le lien de confirmation.
    email_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f"Profile<{self.user.email or self.user.username}>"


def get_or_create_profile(user) -> Profile:
    """Récupère (ou crée) le profil d'un utilisateur.

    Pratique pour les comptes créés AVANT l'ajout du modèle Profile (ils n'ont
    pas encore de profil) : on le crée à la volée plutôt que de planter.
    """
    profile, _ = Profile.objects.get_or_create(user=user)
    return profile


class DataRequest(models.Model):
    """Journal d'audit des demandes RGPD (registre des demandes d'export).

    [Perturbation J3-bis — RGPD] Trace chaque demande d'export de données
    personnelles (droit d'accès Art. 15 et portabilité Art. 20). Pour chaque
    demande, on conserve : QUI l'a faite, QUAND, son STATUT, la DATE DE RÉPONSE
    et l'EMPREINTE (hash SHA-256) du fichier remis.

    Objectif : matérialiser le principe de responsabilité (« accountability »,
    Art. 5.2 RGPD) — pouvoir prouver que les demandes des utilisateurs sont
    bien reçues et traitées. Ces lignes ne sont pas modifiables depuis
    l'interface : ce sont des enregistrements d'audit.
    """

    class RequestType(models.TextChoices):
        EXPORT = "export", "Export des données (Art. 15 & 20)"

    class Status(models.TextChoices):
        RECEIVED = "received", "Reçue"
        IN_PROGRESS = "in_progress", "En cours"
        COMPLETED = "completed", "Répondue"
        FAILED = "failed", "Échec"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="data_requests",
        help_text=(
            "Utilisateur à l'origine de la demande. Conservé à null si le compte "
            "est supprimé, afin de garder la trace d'audit sans donnée personnelle."
        ),
    )
    request_type = models.CharField(
        max_length=20,
        choices=RequestType.choices,
        default=RequestType.EXPORT,
        verbose_name="Type de demande",
    )
    export_format = models.CharField(
        max_length=10,
        blank=True,
        help_text="Format du fichier remis (json, csv).",
    )
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.RECEIVED,
        verbose_name="Statut",
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Reçue le")
    responded_at = models.DateTimeField(null=True, blank=True, verbose_name="Répondue le")
    file_name = models.CharField(max_length=255, blank=True, verbose_name="Fichier")
    file_hash = models.CharField(
        max_length=64,
        blank=True,
        help_text="Empreinte SHA-256 du fichier exporté (preuve d'intégrité).",
        verbose_name="Empreinte SHA-256",
    )

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Demande RGPD"
        verbose_name_plural = "Demandes RGPD (audit)"

    def __str__(self) -> str:
        who = self.user.email if self.user else "compte supprimé"
        return (
            f"DataRequest<{self.get_request_type_display()} · {who} · {self.get_status_display()}>"
        )

    def mark_completed(self, *, content: bytes, file_name: str, export_format: str) -> None:
        """Marque la demande comme répondue et enregistre l'empreinte du fichier.

        `content` est le contenu binaire exact du fichier remis à l'utilisateur ;
        on en calcule le hash SHA-256 pour prouver plus tard son intégrité.
        """
        self.file_hash = hashlib.sha256(content).hexdigest()
        self.file_name = file_name
        self.export_format = export_format
        self.status = self.Status.COMPLETED
        self.responded_at = timezone.now()
        self.save(
            update_fields=[
                "file_hash",
                "file_name",
                "export_format",
                "status",
                "responded_at",
            ]
        )
