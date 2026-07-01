# Note de décision — Customer Journey

> **Modifications apportées au parcours utilisateur d'EduTutor IA — James MBA FONGANG**

## Identification

| Champ | Valeur |
|---|---|
| Projet | EduTutor IA · Édition 2026 · Semaine immersive Scrum |
| Équipe n° | 28 |
| Artefact concerné | Artefact 3 — Customer Journey (parcours utilisateur) |
| Contexte | Cadrage — intégration suite à la **Perturbation J1** (ajout de l'enseignante) |
| Rédigé par | **James MBA FONGANG** |
| Version | V1.0 |
| Date | 30/06/2026 |
| Sources | Fichier de base (note de cadrage) · Fiches persona v2.0 · Note de décision Perturbation J1 · Écrans réels du site (frontend React) |

## 1. Objet de la note

Cette note documente **toutes les modifications que j'ai apportées à l'artefact Customer Journey** par rapport au fichier de base fourni, et les met en relation avec la Perturbation J1. Elle répond à la question : *« Qu'est-ce qui a été mis en place pour le Customer Journey ? »*

## 2. Point de départ (fichier de base) → décision

Dans le fichier de base fourni (note de cadrage), la section **Customer Journey était vide**, marquée « À compléter ». Aucun parcours utilisateur n'existait.

**Décision :** créer l'artefact Customer Journey en cartographiant le parcours des personas utilisateurs du MVP, en s'appuyant sur le site réel, et en intégrant la nouvelle cible enseignante introduite par la Perturbation J1.

| AVANT (fichier de base) | APRÈS (ce que j'ai mis en place) |
|---|---|
| Section « Customer Journey : À compléter » (vide) | 2 cartes de parcours complètes (Léa + Sophie) |
| Aucun parcours utilisateur formalisé | Chaque étape reliée à un écran réel du site |
| Aucun lien entre l'expérience utilisateur et les écrans du site | Ligne « Couverture produit » (déjà livré vs à construire) |
| — | Intégration de la cible enseignante issue de la Perturbation J1 |

## 3. Modifications apportées (synthèse)

- Création de l'artefact Customer Journey, jusque-là marqué « À compléter ».
- Production de **deux cartes de parcours** complètes : une par persona utilisateur du MVP.
- Parcours de **Léa Martin** (étudiante, persona PRIMAIRE) — aligné sur le MVP déjà codé.
- Parcours de **Mme Sophie Lefèvre** (enseignante, persona SECONDAIRE) — passé en MUST suite à la Perturbation J1.
- Rattachement de chaque étape à un **écran réel du site** (traçabilité parcours ↔ code).
- Ajout d'une ligne **« Couverture produit »** distinguant ce qui est déjà livré de ce qui reste à construire.

## 4. Méthode employée

Pour que les parcours soient crédibles et non inventés, j'ai croisé **trois sources** :

- Les **fiches persona v2.0** : objectifs SMART, frustrations et verbatims réels.
- Le **site réel** : routes et pages du frontend React (HomePage, UploadPage, QuizPage, DashboardPage, ReviewMistakesPage, HistoryPage, ProfilePage).
- La **note de décision de la Perturbation J1**, qui fait entrer l'enseignante dans le périmètre de la Release 1.

## 5. Détail des apports — Parcours de Léa (étudiante, PRIMAIRE)

Parcours nominal en 6 étapes, **entièrement couvert par le site existant** :

| Étape | Écran du site | Couverture |
|---|---|---|
| 1. Découverte du besoin | HomePage | ✅ Dans le site |
| 2. Inscription | SignupPage / VerifyEmailPage | ✅ Dans le site |
| 3. Premier quiz | UploadPage + génération LLM | ✅ Dans le site |
| 4. Passage du quiz | QuizPage | ✅ Dans le site |
| 5. Analyse & révision | DashboardPage / ReviewMistakesPage | ✅ Dans le site |
| 6. Usage récurrent | HistoryPage / DashboardPage | 🟡 Partiel (relances à venir, R2) |

## 6. Détail des apports — Parcours de Sophie (enseignante, MUST J1)

Parcours cible en 6 étapes : il **matérialise la Perturbation J1**. Plusieurs briques restent à construire :

| Étape | Besoin couvert | Couverture |
|---|---|---|
| 1. Découverte du besoin | Argumentaire enseignant | 🟡 Partiel |
| 2. Inscription enseignante | Rôle / espace enseignant | 🟠 À construire (J1) |
| 3. Création quiz de classe | Paramètres (niveau, type) | 🟡 Partiel |
| 4. Diffusion aux élèves | Affectation à la classe | 🟠 À construire (J1) |
| 5. Suivi des résultats | Tableau de bord enseignant | 🟠 À construire (J1, MUST) |
| 6. Conseils & fidélisation | Conseils personnalisés | 🟠 À construire (J1, MUST) |

## 7. Ce que ça change / apporte au projet

- Le parcours de **Léa** confirme que le cœur du MVP est cohérent et déjà livré de bout en bout.
- Le parcours de **Sophie** traduit la Perturbation J1 en **4 briques produit concrètes** à développer (rôle enseignant, paramètres de quiz, diffusion classe, tableau de bord + conseils).
- La **Règle d'Or** est respectée : l'ajout de l'enseignante ne modifie pas le parcours étudiant.
- Les **« moments de vérité »** identifiés (génération du 1er quiz, fiabilité en public, suivi de classe) orientent les priorités et le futur backlog.

## 8. Livrables produits

- `docs/customer-journey/lea-martin-etudiante/equipe-28-customer-journey-lea-v1.0.docx`
- `docs/customer-journey/sophie-lefevre-enseignante/equipe-28-customer-journey-sophie-v1.0.docx`
- `docs/customer-journey/README.md` (guide de lecture du dossier)
- La présente note de décision (`.docx` + `.md`).

## 9. Reste à faire / pistes

- *Optionnel* : ajouter un parcours d'ACHAT pour M. David Chen (persona tertiaire) si « 1 journey par persona » est exigé.
- Transformer les opportunités repérées en **User Stories** dans le Product Backlog (US-XX).
- Prévoir les **relances / rappels** de révision (parcours de Léa, étape 6) en Release 2.
