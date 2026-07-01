# Document de veille — Sécurité des LLM : Prompt Injection (OWASP LLM01)

**Projet :** EduTutor IA — APOCAL'IPSSI 2026
**Perturbation :** J3 — Conformité / Éthique
**Équipe :** _[à compléter]_
**Rédacteur·rice :** _[à compléter]_
**Date :** _[à compléter]_
**Statut :** Brouillon — sections code/tests/note de sécurité à venir

---

## 1. Objectif de la veille

Cette veille a pour but de comprendre la vulnérabilité identifiée lors de la perturbation J3 (prompt injection via texte caché dans un document uploadé), de la situer par rapport à l'état de l'art de la sécurité des LLM, et d'identifier les contre-mesures reconnues avant de les implémenter dans le code (partie à traiter séparément).

## 2. Périmètre

- La vulnérabilité **OWASP LLM01:2025 — Prompt Injection**, classée n°1 du classement OWASP Top 10 for LLM Applications.
- Les familles d'attaques (injection directe, indirecte, jailbreak, extraction de system prompt, dépassement de format de sortie).
- Des incidents réels documentés dans l'industrie.
- Les grandes familles de contre-mesures recommandées par OWASP (à visée défensive, pas encore d'implémentation).

## 3. Sources consultées

- OWASP Top 10 for LLM Applications, édition 2025 (owasp.org)
- Analyses techniques de cabinets spécialisés en sécurité applicative des LLM (Aembit, BSG, Mend, Promptfoo, DeepTeam)
- Retours d'expérience presse/juridique sur des incidents réels (Microsoft Bing Chat/Sydney, plugins ChatGPT, Air Canada)
- Documentation pédagogique du module (cours Agile/Scrum, podcast de décodage J3)

## 4. Synthèse : qu'est-ce que la prompt injection ?

La prompt injection consiste à manipuler l'entrée fournie à un LLM pour détourner, contourner ou altérer les instructions prévues par l'application. C'est la première place du classement OWASP depuis deux éditions consécutives, car l'injection directe peut prendre la forme d'un détournement d'instruction, d'une réattribution de rôle, d'une confusion de délimiteurs, d'un encodage ou d'une attaque progressive sur plusieurs tours.

La raison structurelle de cette vulnérabilité est que les LLM traitent les instructions et les données dans le même canal sans séparation claire, ce qui permet à un attaquant de construire une entrée que le modèle interprète comme une nouvelle instruction plutôt que comme du contenu à traiter. Le modèle ne dispose pas nativement d'un mécanisme pour distinguer une consigne légitime d'une consigne injectée.

On distingue deux grandes catégories :

- **Injection directe** : l'attaquant tape lui-même les instructions malveillantes dans le prompt (ex. « ignore les instructions précédentes »).
- **Injection indirecte** : les instructions malveillantes sont dissimulées dans un contenu externe que le LLM va lire — document uploadé, page web, e-mail, ticket, dépôt de code, base de connaissances — et devient particulièrement dangereuse dans les applications utilisant la génération augmentée par récupération (RAG), des plugins, des outils ou des agents, car le modèle peut traiter un contenu externe malveillant comme une instruction de confiance.

C'est exactement le scénario J3 : le texte « IGNORE TOUTES LES INSTRUCTIONS PRÉCÉDENTES... » caché en blanc sur blanc dans un cours uploadé est une **injection indirecte** — la forme la plus difficile à détecter car elle ne passe pas par le champ de saisie utilisateur mais par un document tiers.

Point important pour la note de sécurité à venir : l'injection de prompt reste la vulnérabilité la plus fondamentale des applications LLM et probablement la plus difficile à éliminer totalement, et il n'existe pas de correctif définitif car cette faille exploite la conception même des LLM — d'où la nécessité d'une défense en profondeur plutôt que d'un filtre unique.

## 5. Cas réels documentés

| Cas | Année | Ce qui s'est passé | Conséquence |
|---|---|---|---|
| Bing Chat / Sydney (Microsoft) | 2023 | Contournement des garde-fous par prompt injection en conversation | Révision complète du cadre de sécurité par Microsoft |
| Plugins ChatGPT (OpenAI) | 2023 | Injection via des pages web traitées par les plugins (injection indirecte) | Restriction de l'accès web par OpenAI |
| Air Canada | 2024 | Un chatbot a fourni des informations tarifaires erronées présentées comme engageantes | Précédent juridique : l'entreprise a été tenue responsable des sorties de son LLM |

Ces trois cas illustrent chacun une facette différente du risque : contournement conversationnel, injection indirecte via contenu externe, et responsabilité légale liée à une sortie de LLM non validée — ce dernier point est directement pertinent pour la validation post-LLM exigée dans le livrable J3.

## 6. Grandes familles de contre-mesures recommandées (état de l'art)

À noter dès maintenant pour la partie code/patch (à traiter séparément par l'équipe) : OWASP recommande une approche en défense en profondeur plutôt qu'un filtre isolé. Les leviers identifiés dans la littérature :

1. **Séparation structurelle** system prompt / user input / contenu externe (rôles API, délimiteurs), pour empêcher la confusion entre instruction et donnée.
2. **Restriction des privilèges** des outils/agents connectés au LLM (principe du moindre privilège).
3. **Filtrage entrée/sortie** (input validation + output filtering).
4. **Validation humaine** pour les actions sensibles (human-in-the-loop).
5. **Tests adversariaux réguliers**, y compris automatisés en CI — cohérent avec le livrable J3 qui exige au moins un test adversarial dans le pipeline.
6. Contrainte du comportement du modèle par le system prompt et définition explicite du format de sortie attendu, avec **isolation du contenu externe non fiable** pour qu'il ne puisse pas influencer les instructions.

Ces pistes seront reprises et adaptées concrètement dans la note de sécurité (diagnostic / stratégie défensive / limites résiduelles) et dans le patch de code, à rédiger dans un second temps par l'équipe.

## 7. Limites de cette veille

- Cette synthèse reste volontairement généraliste ; elle ne remplace pas l'analyse du code réel d'EduTutor IA.
- Aucune des contre-mesures listées n'est présentée comme suffisante à elle seule — c'est un point à assumer explicitement dans la note de sécurité.
- Le classement OWASP souligne lui-même qu'il n'existe pas de méthode garantissant une prévention totale de la prompt injection.

## 8. Références

- OWASP, *Top 10 for LLM Applications*, édition 2025 — https://owasp.org/www-project-top-10-for-large-language-model-applications/
- Aembit, *OWASP Top 10 LLM Risks Explained*
- BSG, *OWASP LLM Top 10 (2025): Vulnerabilities & Mitigations*
- Mend, *2025 OWASP Top 10 for LLM Applications: Quick Guide*
- Promptfoo, *OWASP LLM Top 10*
- Podcast de décodage J3 — APOCAL'IPSSI 2026 (Mohamed EL AFRIT / NotebookLM)
