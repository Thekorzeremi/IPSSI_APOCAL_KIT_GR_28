# Réponse à la demande d'accès aux données — Hugo Petit (Art. 15 RGPD)

---

**De :** EduTutor IA — Délégué à la Protection des Données  
**À :** hugo.petit@test.local  
**Objet :** Réponse à votre demande d'accès à vos données personnelles (Art. 15 RGPD) — Réf. SAR-2026-001  
**Date :** 2026-07-01  

---

Monsieur Petit,

Nous avons bien reçu votre demande d'accès à vos données personnelles formulée le mercredi 1er juillet 2026 en application de l'article 15 du Règlement Général sur la Protection des Données (RGPD — UE 2016/679). Votre demande a été enregistrée sous la référence **SAR-2026-001**.

## Données transmises

Conformément à votre demande, vous trouverez en pièce jointe (ou via le lien de téléchargement sécurisé ci-dessous) l'intégralité des données personnelles que nous détenons vous concernant, associées au compte **hugo.petit@test.local**.

**Lien de téléchargement :** `https://edututor-ia.example/api/accounts/me/export/?token=<TOKEN_SIGNÉ>`  
*(Lien valable 48 heures à compter de l'envoi du présent email)*

Le fichier d'export au format **JSON** contient les six catégories de données suivantes :

| Catégorie | Contenu |
|---|---|
| `account` | Email, nom d'affichage, date d'inscription, date de dernière connexion, statut du compte |
| `uploaded_content` | Tous les textes et documents que vous avez soumis à la plateforme, avec horodatage |
| `quizzes` | Tous les quiz générés à partir de vos contenus (questions, options, correction) |
| `quiz_attempts` | Vos réponses à chaque question et vos scores, avec date et durée de chaque session |
| `reports` | Les signalements que vous avez émis, leur statut et la réponse apportée |
| `audit_logs` | L'historique des accès et actions techniques liés à votre compte |

Le fichier est au format **JSON structuré et lisible par machine**, conforme à l'exigence de portabilité de l'article 20 du RGPD. Un export alternatif au format **CSV** est disponible en ajoutant le paramètre `?format=csv` à l'URL d'export.

## Informations complémentaires sur vos données

**Responsable du traitement :** EduTutor IA — Groupe 28, IPSSI Paris  
**Finalité du traitement :** Fourniture d'un service de révision pédagogique personnalisée par LLM  
**Base juridique :** Exécution du contrat de service (Art. 6(1)(b)) ; intérêt légitime (Art. 6(1)(f)) pour les logs de sécurité  
**Durées de conservation :** Voir notre [Politique de rétention des données](./politique-retention-rgpd.md) publiée sur notre plateforme

## Vos droits

En complément de votre droit d'accès (Art. 15), nous vous informons des droits suivants dont vous disposez :

- **Art. 16 — Droit de rectification :** vous pouvez corriger toute donnée inexacte via la page Profil ou en nous contactant.
- **Art. 17 — Droit à l'effacement :** vous pouvez demander la suppression de votre compte et de l'ensemble de vos données. La procédure est disponible dans les paramètres de votre compte (bouton « Supprimer mon compte ») ou sur simple demande à notre DPO.
- **Art. 18 — Droit à la limitation du traitement :** vous pouvez demander la suspension temporaire du traitement de vos données pendant l'instruction d'une éventuelle contestation.
- **Art. 20 — Droit à la portabilité :** l'export JSON fourni en réponse à cette demande est directement réutilisable dans tout système compatible.

## Contact et réclamation

Pour toute question relative à ce traitement ou pour exercer l'un de vos droits :

**Délégué à la Protection des Données (DPO)**  
Email : `dpo@edututor-ia.example`  
Délai de réponse : 30 jours maximum (Art. 12(3) RGPD)

Si vous estimez que le traitement de vos données ne respecte pas le RGPD, vous disposez du droit d'introduire une réclamation auprès de la **Commission Nationale de l'Informatique et des Libertés (CNIL)** :  
Site : www.cnil.fr — Téléphone : 01 53 73 22 22

Nous restons à votre disposition pour toute question complémentaire.

Cordialement,

**L'équipe EduTutor IA — Groupe 28**  
Délégué à la Protection des Données  
`dpo@edututor-ia.example`

---

*Référence interne : SAR-2026-001 | Statut : Répondue | Date de réponse : 2026-07-01*
