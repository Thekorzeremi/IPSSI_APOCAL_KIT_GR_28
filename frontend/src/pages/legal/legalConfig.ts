/**
 * Informations légales centralisées pour EduTutor IA.
 *
 * ⚠️ ÉQUIPE 28 : les valeurs entre crochets [ ... ] sont des espaces réservés
 * à personnaliser avec vos informations réelles avant une mise en production
 * (raison sociale exacte, adresse postale, emails de contact, nom du directeur
 * de publication). Le reste est déjà rédigé et adapté au projet.
 */
export const LEGAL = {
  /** Nom du service. */
  service: 'EduTutor IA',
  /** Éditeur du site. */
  editeur: 'Équipe 28 — Projet étudiant EduTutor IA',
  statut:
    'Projet pédagogique non commercial réalisé dans le cadre de la semaine APOCAL’IPSSI 2026 (IPSSI)',
  adresse: '[Adresse postale de l’équipe / de l’établissement — à compléter]',
  email: '[contact@edututor.example — à compléter]',
  /** Personne responsable du contenu publié. */
  directeurPublication: '[Nom du directeur de la publication — à compléter]',
  /** Référent données / DPO (fictif dans le cadre pédagogique). */
  dpoEmail: '[dpo@edututor.example — à compléter]',
  /** Hébergeur (le kit fournit un déploiement VPS OVH). */
  hebergeur: 'OVHcloud (SAS OVH)',
  hebergeurAdresse: '2 rue Kellermann, 59100 Roubaix, France',
  hebergeurTel: '+33 (0)9 72 10 10 07',
  /** Fournisseur LLM par défaut du projet. */
  llmParDefaut: 'Ollama, exécuté localement (modèle Llama 3.1 8B)',
  /** Date de dernière mise à jour affichée en bas des pages. */
  derniereMaj: '1er juillet 2026',
} as const;
