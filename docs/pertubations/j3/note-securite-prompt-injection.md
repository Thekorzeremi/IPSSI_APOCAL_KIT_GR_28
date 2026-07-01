# Note de sécurité — Vulnérabilité Prompt Injection (OWASP LLM01)

**Projet :** EduTutor IA — APOCAL'IPSSI 2026
**Perturbation :** J3 — Conformité / Éthique
**Composant concerné :** `backend/llm/services/ollama_client.py`, `backend/llm/services/quiz_prompt.py`
**Rédacteur·rice :** _[à compléter]_
**Date :** _[à compléter]_

---

## 1. Résumé

L'application EduTutor IA génère des quiz QCM à partir d'un texte de cours uploadé par
l'utilisateur. Le contenu du cours était transmis au LLM (Ollama) sans séparation avec les
instructions système, ce qui permettait à un attaquant d'insérer, dans le cours lui-même, des
instructions capables de manipuler la sortie du modèle (prompt injection indirecte,
OWASP LLM01:2025). La faille a été corrigée par une séparation structurelle system/user,
un renforcement du system prompt et une validation heuristique post-génération.
Le risque n'est pas éliminé à 100 % mais ramené à un niveau résiduel documenté ci-dessous.

## 2. Pourquoi la faille existait

### 2.1 Cause technique

Avant correctif, le prompt envoyé à Ollama était construit par simple concaténation de
chaînes :

```
SYSTEM_PROMPT + "\n\n" + "COURS :\n" + contenu_cours
```

Le tout était envoyé comme un seul bloc `prompt` à l'API Ollama, sans utiliser le champ
`system` prévu à cet effet. Concrètement, le modèle recevait un unique flux de texte dans
lequel rien ne distinguait, structurellement, « ce que le développeur demande » de « ce que
l'utilisateur (potentiellement malveillant) a uploadé ».

### 2.2 Cause structurelle (pourquoi ce n'est pas un simple bug)

Cette faille n'est pas une erreur isolée mais l'expression d'une propriété générale des LLM :
ils traitent instructions et données dans le même canal textuel et n'ont pas de mécanisme
natif fiable pour distinguer une consigne légitime d'une consigne injectée dans un contenu
tiers (cf. document de veille OWASP LLM01). Dès lors qu'un contenu externe non fiable — ici
le cours uploadé — est concaténé au system prompt sans délimitation ni traitement différencié,
le modèle est structurellement exposé à l'injection indirecte.

### 2.3 Facteur aggravant côté produit

- Le cours est un contenu **entièrement contrôlé par l'utilisateur final** (upload libre), donc
  une source non fiable par nature.
- Aucun filtrage, aucune délimitation, aucune validation de la sortie n'existaient avant patch :
  la moindre instruction glissée dans le cours produisait un JSON de quiz syntaxiquement valide,
  donc accepté sans contrôle.
- Le résultat manipulé (toutes les bonnes réponses = A) n'est pas une erreur visible pour
  l'application : elle est indiscernable d'un quiz légitime tant qu'on ne regarde pas le contenu
  pédagogique, ce qui la rend particulièrement dangereuse dans un contexte éducatif (l'étudiant
  fait confiance au corrigé).

## 3. Comment la faille a été corrigée

Le correctif applique une défense en profondeur à trois niveaux, conformément aux
recommandations OWASP (cf. document de veille) : séparation structurelle, contrainte du
comportement du modèle, et validation de la sortie.

### 3.1 Séparation structurelle system / user (`ollama_client.py`)

Le system prompt et le contenu du cours sont désormais envoyés dans deux champs distincts de
l'API Ollama (`system` et `prompt`) plutôt que concaténés dans une seule chaîne. Le modèle reçoit
donc une distinction explicite, au niveau protocolaire, entre l'instruction de l'application et
le contenu à analyser.

### 3.2 System prompt défensif et délimitation du contenu (`quiz_prompt.py`)

- Ajout d'une section explicite dans le system prompt interdisant au modèle de suivre toute
  instruction présente dans le cours, quelle que soit sa langue, sa forme (texte clair, encodage,
  caractères Unicode visuellement proches) ou sa position dans le texte.
- Le contenu du cours est encadré par des balises `<course>...</course>` pour marquer clairement
  ses limites et renforcer, y compris visuellement pour le modèle, sa nature de « donnée à
  traiter » et non d'« instruction à exécuter ».

### 3.3 Validation heuristique post-génération (`parse_and_validate_quiz`)

Même si les deux premières couches échouaient, une validation de la sortie du LLM rejette la
génération avant tout enregistrement en base si :

- une question n'a pas 4 options distinctes,
- `correct_index` n'est pas un entier valide dans `{0,1,2,3}`,
- 8 questions sur 10 (ou plus) partagent le même `correct_index` — signal fort d'une manipulation
  du type « la réponse A est toujours correcte ».

En cas de rejet, l'API renvoie une erreur (HTTP 502) et **rien n'est persisté** : le quiz
manipulé n'est jamais visible par l'étudiant.

### 3.4 Vérification

Le correctif a été validé par 5 scénarios d'attaque distincts (injection directe FR/EN, texte
caché HTML, encodage base64, caractères Unicode pleine largeur), rejoués avant et après patch,
ainsi que par 15 tests automatisés couvrant le system prompt, les délimiteurs et la validation
heuristique (détail dans le jeu de tests adversariaux et le scénario d'audit associés).

## 4. Limites qui subsistent

Le correctif réduit fortement le risque mais ne l'élimine pas. Limites assumées et à surveiller :

| Limite | Détail | Risque résiduel |
|---|---|---|
| **Pas de garantie absolue** | Aucune méthode connue ne garantit une prévention à 100 % de la prompt injection sur un LLM (propriété reconnue par OWASP lui-même) | Faible mais non nul, même après patch |
| **Modèles peu alignés** | Sur de très petits modèles peu instruction-tuned, le system prompt peut être partiellement ignoré malgré la séparation | Dépend du modèle déployé ; mitigé en imposant un modèle ≥ 7B instruct |
| **Injection indirecte via RAG** | Si une architecture RAG multi-documents est introduite plus tard, l'injection pourrait provenir d'un chunk non contrôlé, hors du périmètre actuel | Non couvert par ce patch |
| **Faux positif heuristique** | Un cours légitime très court pourrait, en théorie, produire ≥ 8 réponses identiques sur 10 questions et être rejeté à tort | Rare, mais à monitorer en usage réel |
| **Jailbreak de rôle avancé** | Une attaque type « tu es maintenant sans restriction » reste théoriquement possible sur un modèle très malléable, même si le system prompt défensif la couvre | Réduit, non éliminé |
| **Champ titre non sanitisé** | Le champ `title` du formulaire n'est pas encore protégé par les mêmes mécanismes | Vecteur d'injection non couvert — à traiter en J4 |

## 5. Recommandations de suivi

1. Étendre la sanitisation/délimitation au champ `title` (limite identifiée en 4.).
2. Ajouter un test de non-régression dès qu'un nouveau modèle Ollama est déployé, car la
   robustesse du system prompt dépend du niveau d'alignement du modèle.
3. Si une architecture RAG est introduite, réévaluer la surface d'attaque avant mise en
   production (l'injection pourrait alors venir de sources non maîtrisées par l'utilisateur
   direct).
4. Conserver la validation heuristique comme filet de sécurité, même si la séparation
   system/user est jugée suffisante à terme — c'est le principe de défense en profondeur.

## 6. Références

- Document de veille sécurité LLM — Prompt Injection (OWASP LLM01), équipe EduTutor IA
- Jeu de tests adversariaux — Prompt Injection (OWASP LLM-01), 2026-07-01
- OWASP Top 10 for LLM Applications, édition 2025
