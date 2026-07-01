"""Admin de l'app accounts.

L'admin Django par défaut suffit pour User. On enregistre en plus le registre
des demandes RGPD (`DataRequest`) en LECTURE SEULE : c'est un journal d'audit,
il ne doit être ni créé ni modifié à la main depuis l'interface.
"""

from django.contrib import admin

from .models import DataRequest


@admin.register(DataRequest)
class DataRequestAdmin(admin.ModelAdmin):
    """Consultation du registre des demandes d'export (audit RGPD)."""

    list_display = (
        "id",
        "user",
        "request_type",
        "export_format",
        "status",
        "created_at",
        "responded_at",
        "short_hash",
    )
    list_filter = ("status", "request_type", "export_format", "created_at")
    search_fields = ("user__email", "user__username", "file_hash", "file_name")
    date_hierarchy = "created_at"
    ordering = ("-created_at",)
    readonly_fields = (
        "user",
        "request_type",
        "export_format",
        "status",
        "created_at",
        "responded_at",
        "file_name",
        "file_hash",
    )

    @admin.display(description="Empreinte")
    def short_hash(self, obj: DataRequest) -> str:
        """Affiche un extrait lisible de l'empreinte SHA-256."""
        return f"{obj.file_hash[:12]}…" if obj.file_hash else "—"

    def has_add_permission(self, request) -> bool:
        # Journal d'audit : aucune création manuelle.
        return False

    def has_change_permission(self, request, obj=None) -> bool:
        # Consultation uniquement, pas de modification.
        return False
