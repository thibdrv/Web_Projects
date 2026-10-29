# Greek trainer

L'application a un **menu** avec huit catégories :

- **Greek letters** : lire le grec et l'écrire en lettres latines (198 mots, alphabet, paires de lettres).
- **Colors** : 18 couleurs, avec 5 jeux (mot → couleur, couleur → mot, écoute, phrases à compléter, mélange de peintures).
- **Grammar** : verbes au présent, au passé et au futur, 32 verbes, du plus facile au plus difficile (9 niveaux), avec un tableau de conjugaison, un QCM et une saisie.
- **Numbers** : les nombres de 0 à 1000, par niveaux (0–10, 11–20, dizaines, 21–99, centaines), avec 5 jeux : chiffre → mot, mot → chiffre, écoute, écriture en lettres latines, additions lues en grec.
- **Family & animals** : 23 mots de la famille et 30 animaux, avec images, 6 jeux et le genre de chaque nom (ο, η ou το).
- **Food & drinks** : 66 mots (fruits et légumes, plats, boissons, repas), avec images et les mêmes jeux.
- **Dictionary** : tous les mots de l'application dans une seule liste (noms, verbes, adjectifs, nombres, phrases, lettres…), en deux modes. **Browse** : de A à Ω, avec filtres par type et par catégorie. **Search** : tape en grec, en anglais ou en lettres latines (`kafes`, `coffee`, `καφές`, sans accents si tu veux). Pour un verbe, tu peux même chercher une forme conjuguée (`grapso` trouve γράφω). Touche un mot pour l'entendre ; sur un verbe, « Conjugation » déplie le tableau.
- **Level test** : 20 questions en 5 paliers, du très facile au difficile, tirées au hasard dans tout le contenu de l'appli (lettres, couleurs, nombres, vocabulaire, verbes). À la fin : ton niveau de 0 à 5, ton score dans quatre domaines (lecture, vocabulaire, nombres, grammaire) et les catégories à travailler en priorité. Ton dernier résultat est gardé dans le navigateur.

## Comment l'ouvrir

Double-clique sur **index.html**. C'est tout : pas d'installation, pas de serveur.

## À quoi sert chaque fichier

| Fichier / dossier | Rôle | Quand le modifier |
|---|---|---|
| `index.html` | La structure : le menu et les trois catégories | Pour changer un texte ou ajouter un bouton |
| `css/style.css` | L'apparence : couleurs, tailles, espacements | Pour changer le look |
| `data/greek-data.js` | Les mots, phrases et lettres de **Greek letters** | Pour ajouter / corriger des mots |
| `data/colors.js` | Les couleurs, les phrases et les mélanges de **Colors** | Pour ajouter une couleur ou une phrase |
| `data/grammar.js` | Les verbes, les temps et les niveaux de **Grammar** | Pour ajouter un verbe |
| `data/numbers.js` | Les nombres de **Numbers** | Rarement |
| `data/family.js` | Les mots de **Family & animals** | Pour ajouter un mot ou un animal |
| `data/food.js` | Les mots de **Food & drinks** | Pour ajouter un aliment ou une boisson |
| `audio/` | Un fichier MP3 par texte grec de l'application | Rempli par le script, pas à la main |
| `tools/make_audio.py` | Le script qui fabrique les MP3 avec la voix Athina | Quand tu ajoutes des textes grecs |
| `js/router.js` | Le menu et la navigation entre catégories | Rarement |
| `js/quiz.js` | Le « moteur de jeu » commun à Colors et Grammar (10 questions, score, meilleur score) | Pour changer le déroulé des jeux |
| `js/colors.js` | La catégorie Colors : modes et questions | Pour changer ou ajouter un jeu de couleurs |
| `js/grammar.js` | La catégorie Grammar : niveaux, tableaux, questions | Pour changer la grammaire |
| `js/numbers.js` | La catégorie Numbers : niveaux, jeux, additions | Pour changer les jeux de nombres |
| `js/vocab.js` | Le moteur des catégories « liste de mots avec images » (utilisé par Family & animals et Food & drinks) | Pour changer ses jeux, ou créer une catégorie du même type |
| `js/audio.js` | Lecture des fichiers MP3 | Rarement |
| `js/transliteration.js` | Les règles grec → lettres latines (ου = ou, μπ = b…) | Pour ajuster les orthographes acceptées |
| `js/practice.js`, `js/alphabet.js` | Les deux onglets de Greek letters | Pour changer l'exercice ou les cartes |
| `js/dictionary.js` | La catégorie Dictionary : elle se construit toute seule à partir des fichiers de `data/` | Pour changer la recherche ou les filtres |
| `js/leveltest.js` | La catégorie Level test : les 20 questions, le calcul du niveau, l'écran de résultat | Pour changer les questions ou les seuils de niveau |
| `js/helpers.js`, `js/main.js` | Petits outils, onglets, démarrage | Rarement |
| `original/` | Ta version d'origine, intacte (sauvegarde) | Jamais |

L'ordre des `<script>` à la fin de `index.html` compte : ne le change pas.

## Le test de niveau : comment le niveau est calculé

Les 20 questions forment 5 paliers de 4 questions, de plus en plus difficiles. Ton niveau est le palier le plus haut où tu as au moins 3 bonnes réponses sur 4, **à condition** d'avoir au moins 70 % de réussite sur l'ensemble des paliers jusque-là. Répondre au hasard donne donc le niveau 0. Les textes des niveaux et les questions de chaque palier sont en haut de `js/leveltest.js` (`TEST_LEVELS` et `TEST`). Le test ne mesure que ce que l'application enseigne : c'est une estimation, pas un diplôme.

## Fabriquer les MP3 (voix grecque Athina)

Le script `tools/make_audio.py` fabrique un MP3 pour chaque texte grec des six fichiers de `data/` (mots, noms de lettres, couleurs, phrases, formes des verbes) avec la voix **el-GR-AthinaNeural**. Tout est déjà dans `audio/`. Tu n'as besoin de relancer le script que si tu ajoutes ou changes des textes grecs.

Le nom d'un fichier est calculé à partir du texte grec lui-même (une « empreinte » de quelques caractères), donc l'application retrouve toute seule le bon son : il n'y a rien à écrire dans les données.

Il y a deux « moteurs », avec la même voix :

| Moteur | Compte / clé | Remarque |
|---|---|---|
| `edge` (par défaut) | **Aucun** | Utilise le service de lecture à voix haute d'Edge, via le petit outil `edge-tts`. Gratuit, mais non officiel : Microsoft peut le modifier ou le limiter. Pratique pour un usage personnel. |
| `azure` | Clé Azure (voir plus bas) | Service officiel, plus fiable, avec un quota gratuit. À préférer si tu partages l'application publiquement. |

### Avec le moteur edge (le plus simple)

Une seule fois, installe l'outil :

```bash
python -m pip install edge-tts
```

Puis, depuis le dossier `greek-app` :

```bash
python tools/make_audio.py --dry-run
```
Affiche ce qui serait fabriqué, sans rien envoyer.

```bash
python tools/make_audio.py
```
Fabrique les MP3 manquants (il ne refait jamais ceux qui existent), trois à la fois. Si le service refuse trop de mots, essaie `python tools/make_audio.py --workers 1`. Le service refuse parfois un mot : le script réessaie à différentes vitesses, saute le mot s'il résiste, et te donne la liste à la fin. Relance-le simplement un peu plus tard : il ne refait que les manquants. Tu peux aussi l'interrompre (Ctrl+C) et le relancer.

### Avec le moteur Azure (optionnel)

Il faut une clé Azure : un mot de passe qui dit à Microsoft « c'est bien moi qui demande ».

1. Va sur <https://portal.azure.com>, crée un compte gratuit, puis cherche **Speech services** et clique sur « Créer ».
2. Choisis : un groupe de ressources (« Créer nouveau »), une région (ex. `West Europe`), un nom unique, et le niveau **Free F0**.
3. Quand c'est déployé : « Accéder à la ressource », puis **Clés et point de terminaison**. Note **KEY 1** et l'**emplacement** (ex. `westeurope`).
4. Lance : `python tools/make_audio.py --engine azure` (le script te demande la clé, invisible quand tu la tapes, puis la région).

> La clé est secrète : ne la partage pas et ne la mets dans aucun fichier du projet.

### Écouter

Ouvre `index.html` et clique sur « Listen » : l'application joue tes MP3. Si un MP3 manque, il n'y a simplement pas de son pour ce mot ; relance le script pour le créer.

## Ajouter du contenu

Le **Dictionary** se remplit tout seul : un mot ajouté dans un fichier de `data/` y apparaît sans rien faire d'autre.

Dans tous les cas : modifie le fichier de `data/`, puis lance `python tools/make_audio.py` (il ne fabrique que les nouveaux sons).

- **Un mot dans Greek letters** : dans `data/greek-data.js`, copie une ligne de la section voulue, par exemple `{"gr": "καφές", "lat": "kafes", "en": "coffee", "pos": "noun"}` (sans champ `"a"`). `pos` est la nature du mot (`noun`, `verb`, `adjective`, `adverb`, `pronoun`, `conjunction`, `expression`, `number`, `phrase`) : le dictionnaire s'en sert pour le classer ; sans `pos`, le mot est rangé dans « Other ». N'oublie pas la virgule à la fin de la ligne précédente.
- **Une couleur** : dans `data/colors.js`, copie une ligne de `"words"` et change `id` (un nom unique en anglais), `gr`, `lat`, `en` et `hex` (le code couleur, par exemple `#FF00FF`).
- **Une phrase de couleur** : dans `"objects"`. `before` est le début de la phrase, `color` l'`id` de la bonne couleur, `gr` la phrase complète.
- **Un mot de famille, un animal, un aliment ou une boisson** : dans `data/family.js` ou `data/food.js`, copie une ligne, par exemple `{"gr": "ο λαγός", "lat": "o lagos", "en": "hare", "emoji": "🐇"}`. Le `gr` commence par ο, η ou το. L'`emoji` est facultatif : mets-en un seulement s'il est clair et que personne d'autre ne l'utilise.
- **Un nombre** : dans `data/numbers.js`, les nombres de 21 à 99 sont fabriqués par l'application (dizaine + unité, par exemple 35 = τριάντα πέντε) avec les sons déjà là. Tu n'ajoutes rien pour eux.
- **Un verbe** : dans `data/grammar.js`, copie un bloc de `"verbs"`. Il faut 6 formes par temps, dans l'ordre : je, tu, il/elle, nous, vous, ils/elles. Puis ajoute son `id` dans la liste `"verbs"` d'un niveau de `"levels"` pour qu'il apparaisse.

## Refaire tous les sons (autre voix, autre vitesse)

Change `VOICE` ou `RATE` en haut de `tools/make_audio.py`, puis :

```bash
python tools/make_audio.py --force
```
