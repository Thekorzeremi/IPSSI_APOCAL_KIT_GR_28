# Politique de rétention des données personnelles — EduTutor IA

**Responsable du traitement :** Équipe EduTutor IA — Groupe 28  
**Date de rédaction :** 2026-07-01  
**Référence réglementaire :** RGPD (UE) 2016/679 — Articles 5(1)(e), 13, 17

---

## 1. Durées de conservation par type de donnée

| Type de donnée | Durée de conservation | Déclencheur de départ |
|---|---|---|
| Données de compte (email, nom, date d'inscription, mot de passe hashé) | Durée de vie du compte + 12 mois | Désactivation ou suppression du compte |
| Contenus uploadés (textes, documents de cours) | Durée de vie du compte actif | Dernière activité de l'utilisateur |
| Quiz générés | Durée de vie du compte actif + 6 mois | Dernière activité de l'utilisateur |
| Réponses aux quiz et scores | Durée de vie du compte actif + 6 mois | Dernière activité de l'utilisateur |
| Signalements émis | 3 ans | Date d'émission du signalement |
| Logs d'audit et d'accès | 12 mois | Date de génération du log |
| Demandes d'accès (SAR — Subject Access Request) | 5 ans | Date de la demande |
| Tokens de session / JWT | 24 heures (ou révocation explicite) | Date d'émission du token |

> **Compte inactif :** un compte sans connexion depuis 24 mois est considéré inactif. L'utilisateur reçoit une notification par email 30 jours avant l'expiration. En l'absence de réactivation, les données sont supprimées conformément à la section 3.

---

## 2. Motifs légaux de conservation (base juridique Art. 6 RGPD)

### 2.1 Données de compte et contenus pédagogiques
**Base juridique : Exécution d'un contrat (Art. 6(1)(b))**  
La collecte et la conservation des données de compte, des contenus uploadés et des quiz générés sont nécessaires à la fourniture du service EduTutor IA. Sans ces données, il est impossible de personnaliser l'expérience pédagogique ou de maintenir la continuité des sessions de révision.

### 2.2 Réponses aux quiz et scores
**Base juridique : Exécution d'un contrat (Art. 6(1)(b)) + Intérêt légitime (Art. 6(1)(f))**  
Les scores et réponses sont indispensables au fonctionnement du moteur de recommandation pédagogique (suivi de progression, adaptation du niveau). L'intérêt légitime est caractérisé par l'amélioration de la qualité du service sans préjudice pour les droits fondamentaux de l'utilisateur.

### 2.3 Signalements
**Base juridique : Obligation légale (Art. 6(1)(c)) + Intérêt légitime (Art. 6(1)(f))**  
La durée de 3 ans correspond à la prescription civile de droit commun (Art. 2224 Code civil). La conservation permet de traiter d'éventuels litiges et de justifier des décisions de modération.

### 2.4 Logs d'audit
**Base juridique : Obligation légale (Art. 6(1)(c)) + Intérêt légitime sécurité (Art. 6(1)(f))**  
La CNIL recommande une durée de 12 mois pour les logs de connexion et d'accès à des fins de sécurité des systèmes d'information (détection d'intrusion, investigation post-incident).

### 2.5 Demandes SAR (Art. 15 RGPD)
**Base juridique : Obligation légale (Art. 6(1)(c))**  
La traçabilité des demandes d'accès aux données est une exigence de l'accountability RGPD (Art. 5(2)). La durée de 5 ans permet de justifier la conformité lors d'un contrôle CNIL.

---

## 3. Modalités de suppression des données (Art. 17 RGPD — Droit à l'oubli)

### 3.1 Suppression automatique (purge planifiée)

Une tâche automatisée (`cron`) s'exécute **quotidiennement à 02h00 UTC** et supprime :
- les comptes inactifs depuis plus de 24 mois dont l'utilisateur n'a pas répondu à la notification de préavis ;
- les logs d'audit de plus de 12 mois ;
- les tokens de session expirés.

La suppression est **définitive et irréversible** : aucune sauvegarde des données personnelles n'est conservée au-delà des délais définis ci-dessus.

### 3.2 Suppression sur demande (Art. 17 — Droit à l'effacement)

Tout utilisateur peut exercer son droit à l'effacement :
- **Via l'interface** : bouton « Supprimer mon compte » dans la page Profil → suppression de toutes les données personnelles sous **72 heures**.
- **Par email** : en adressant une demande à `dpo@edututor-ia.example` avec preuve d'identité (email du compte concerné).

**Délai de traitement :** 30 jours maximum (Art. 12(3) RGPD). En pratique, la suppression technique intervient sous 72 heures ; le délai de 30 jours couvre l'instruction de la demande.

**Exceptions au droit à l'effacement (Art. 17(3) RGPD) :**
- Obligation légale de conservation (ex. : signalements faisant l'objet d'une procédure judiciaire en cours).
- Défense de droits en justice.
- Dans ces cas, l'utilisateur est informé par écrit de la limitation et de sa durée.

### 3.3 Procédure de suppression technique

1. Anonymisation ou pseudonymisation des données des tables liées (quiz, réponses, signalements) — les agrégats statistiques anonymes sont conservés.
2. Suppression physique de l'entrée `User` en base de données (cascade sur les tables liées via `ON DELETE CASCADE`).
3. Révocation de tous les tokens actifs de l'utilisateur.
4. Journalisation de l'opération de suppression dans l'audit trail SAR avec statut `DELETED` (sans données personnelles résiduelles).

---

*Document soumis à révision annuelle ou à chaque évolution significative des traitements.*
