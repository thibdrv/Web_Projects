# Elliniká

L'application a un **menu** avec vingt-quatre catégories. Elle existe en **anglais et en français** : le bouton rond **⚙️ Réglages**, en haut à droite de **chaque page** (dans le titre sur l'accueil, dans la barre du haut ailleurs), ouvre un petit panneau avec **English / Français**, qui change la langue de tout l'écran (le choix est mémorisé ; au premier lancement, l'appli prend la langue de ton navigateur).

- **Review & progress** (Révision et progression) : l'appli retient chaque mot que tu travailles. Un mot réussi revient de plus en plus tard (1, 2, 4, 8, 16 jours : c'est la **révision espacée**, méthode des boîtes de Leitner) ; un mot raté revient tout de suite (et passe en premier, voir la section « Révision plus intelligente » en bas). La page montre ta **série de jours** de suite, le nombre de mots **à réviser**, tes mots « en cours / familiers / maîtrisés », ta progression par catégorie, et ton dernier test de niveau. **Commencer la révision** pose 10 questions sur les mots dus ; quand il n'y en a plus, **Travailler mes mots faibles** reprend ceux que tu rates le plus. Tout est gardé dans ton navigateur ; **Effacer ma progression** remet à zéro.

- **Greek letters** : lire le grec et l'écrire en lettres latines (1179 mots et phrases, alphabet, paires de lettres, écriture à la main), avec un **filtre de niveau A1 / A2 / B1 / B2**.
  **Niveaux (A1, A2, B1, B2)** : chaque mot de « Greek letters » a un niveau (`"lvl"` dans `data/greek-data.js`), estimé par moi d'après le cadre européen (CECR) : A1 = premiers mots (240), A2 = vie de tous les jours (358), B1 = niveau intermédiaire (316), B2 = niveau avancé (68). Sous les catégories, la rangée **Level** ne garde que les mots d'un niveau. Dans le **dictionnaire**, une liste **Level** fait la même chose et chaque mot a un petit badge A1 / A2 / B1 / B2 ; les autres catégories (couleurs, nourriture, corps…) ont un niveau par catégorie ou par groupe (liste en haut de `js/levels.js`).
  Cette liste a reçu **534 nouveaux mots et phrases** (verbes, adjectifs, sentiments, géographie dont Chypre, cuisine grecque, objets, mots de liaison, travail, technologie, environnement…). Tous sont dans le dictionnaire.
- **Colors** : 18 couleurs, avec 5 jeux (mot → couleur, couleur → mot, écoute, phrases à compléter, mélange de peintures).
- **Grammar** : six sujets, choisis par la rangée de boutons du haut. **Verbs** : présent, passé et futur, 32 verbes, du plus facile au plus difficile (9 niveaux), avec un tableau de conjugaison, un QCM et une saisie. **Plural** (le pluriel des noms : -ος → -οι, -α → -ες…), **Adjectives** (l'adjectif s'accorde : μεγάλος / μεγάλη / μεγάλο), **Cases** (le sujet et le complément : ο φίλος → τον φίλο), **Negation** (δεν pour une phrase, μη / μην pour un ordre) et **Questions** (les mots interrogatifs). Chacun de ces cinq sujets a une page **Learn** (explication + exemples à écouter), un jeu **Choose** (QCM) et un jeu **Write** (écrire la réponse avec le clavier grec).
- **Numbers** : les nombres de 0 à un milliard, par niveaux (0–10, 11–20, dizaines, 21–99, centaines, 10 000 et plus), avec 5 jeux : chiffre → mot, mot → chiffre, écoute, écriture en lettres latines, additions lues en grec.
- **Family & animals** : 23 mots de la famille et 30 animaux, avec images, 6 jeux et le genre de chaque nom (ο, η ou το).
- **Food & drinks** : 66 mots (fruits et légumes, plats, boissons, repas), avec images et les mêmes jeux.
- **Human body** : 117 mots du corps (corps, visage, main et pied, organes et squelette, **les sens et les actions**, **la santé**) avec un **grand schéma interactif** : touche un numéro sur le dessin (ou un mot dans la liste) pour entendre le mot. Sous le grand dessin, de **petits dessins** permettent de zoomer : visage, main, pied, organes, squelette. Les mêmes jeux que Family & animals sont disponibles (images, écoute, écriture, ο / η / το…).
  Sur la page, une rangée de petits dessins en haut permet de passer de **Front** (devant) à **Back** (dos, avec l'omoplate, la colonne, le tendon d'Achille…), au visage, à la main, au pied, aux organes et au squelette. Sur un grand écran, le dessin est à gauche et la liste des mots à droite.
- **Time & dates** : 67 mots en sept groupes : les **jours** (lundi à dimanche, jour, semaine, week-end), les **mois** (janvier à décembre, mois, année, calendrier), les **saisons**, **hier, aujourd'hui, demain** (avant-hier, hier, aujourd'hui, demain, après-demain, maintenant), **les moments de la journée** (matin, midi, après-midi, soir, nuit, heure, minute, date), **avant et après** (avant, après, plus tard, tôt, tard) et **la fréquence** (toujours, souvent, parfois, rarement, jamais, un peu, beaucoup, pas du tout, encore, déjà…). Les mêmes jeux que Family & animals. Les mots qui n'ont pas de « le / la » (hier, toujours…) n'entrent pas dans le jeu ο / η / το, et les groupes sans images n'ont pas le mode Picture.
- **House & clothes** : 115 mots en cinq groupes (les pièces, meubles et objets, cuisine et salle de bains, vêtements, chaussures et accessoires), avec images et les mêmes jeux que Food & drinks.
- **City & travel** : 121 mots (les lieux de la ville, les transports, les directions, voyage et hôtel, achats et argent), avec images et les mêmes jeux.
- **Directions** : 86 mots (gauche, droite, tout droit ; nord, sud, est, ouest et les diagonales ; où est-ce ? ; se déplacer ; routes et panneaux ; distance), avec les flèches ⬅️ ➡️ ⬆️ ⬇️ et la boussole 🧭 comme images.
- **Weather & nature** : 117 mots (météo, paysages, plantes, mer et plage, animaux sauvages et insectes), avec images et les mêmes jeux.
- **Jobs & hobbies** : 120 mots (métiers, travail et école, loisirs et musique, sports), avec images et les mêmes jeux.
- **Opposites** : 62 paires de contraires (124 mots : grand / petit, chaud / froid, j'ouvre / je ferme…) avec les jeux habituels et un jeu en plus, **Opposites** : tu vois un mot, tu touches son contraire.
- **Phrases** : 72 phrases du quotidien en six groupes (se présenter, salutations, questions, nourriture et achats, se déplacer, sentiments et météo), avec le sens en anglais **et en français**. Cinq modes : **Learn** (écouter), **Understand** (choisir le sens), **Build** (toucher les mots dans le bon ordre), **Write it** (écrire la phrase **avec les lettres grecques**, à partir du sens) et **Dictation** (écouter puis écrire). Un **clavier grec** est affiché sous la zone d'écriture, donc pas besoin d'avoir un clavier grec sur ton appareil. Les accents, les majuscules et la ponctuation ne comptent pas : si tu oublies un accent, la réponse est juste, avec un rappel. Un bouton **Hint** donne la prononciation.
- **Dialogues** : 10 petites conversations (faire connaissance, au café, au restaurant, demander son chemin, à l'hôtel, acheter des vêtements, au marché, faire des projets, chez le médecin, en taxi), 84 répliques avec le grec, la prononciation et le sens en anglais et en français. Cinq modes : **Listen & read** (touche une réplique pour l'entendre, ou « Play the dialogue » joue tout, avec une bulle qui s'allume), **Reply** (tu entends une phrase, tu choisis la bonne réponse), **Fill the gap** (un mot manque), **Questions** (tu écoutes tout le dialogue puis tu réponds à une question) et **Say it** (tu lis la réplique à voix haute : le navigateur t'écoute et compare ; il faut Chrome et internet, et le micro doit être autorisé. La reconnaissance du grec n'est pas parfaite : ne te décourage pas).
- **Today (carte « Aujourd'hui » de l'accueil)** : le **mot du jour** (le même toute la journée), un **objectif du jour** (10, 20 ou 30 réponses : touche le chiffre pour le changer), et des boutons pour continuer là où tu t'étais arrêté, lancer le défi d'une minute ou faire ta révision. Le code est dans `js/today.js`.
- **Sauvegarde** (page « Review & progress », en bas) : **Save my progress** met toute ta progression (réponses, séries, scores, niveau, langue, look, objectif) dans un petit fichier `greek-trainer-backup-DATE.json` ; **Restore a backup** le relit, sur cet appareil ou un autre. Rien n'est envoyé sur internet. Le code est dans `js/backup.js`.
- **Mes difficultés** (page « My difficulties », ouverte depuis « Review & progress ») : le carnet d'erreurs. Elle liste les mots que tu rates le plus (plus de faux que de justes, ou encore dans les premières boîtes), les plus difficiles d'abord, avec ✗ faux / ✓ justes, un filtre par catégorie, le son, l'étoile ⭐ et le bouton « Practice these words » (10 questions). Tu peux aussi **ajouter tes propres mots** (« Add my own word » : le mot en grec, son sens ; la prononciation en lettres latines est remplie toute seule) : ils sont en haut de la liste, ont un badge « MON MOT », se suppriment avec 🗑 et reviennent dans les révisions. Ils n'ont pas d'enregistrement : c'est la voix grecque de ton appareil qui les lit (`OWN_TEXT` dans `js/audio.js`, dépend du téléphone/navigateur). Un mot sort de la liste quand tu le maîtrises. Rien n'est stocké en plus : tout vient de `gl-progress` (`Progress.difficultList()`). Le code est dans `js/difficulties.js`.
- **Stories** : 10 petites histoires (57 phrases) à lire et à écouter. Touche un **mot** pour voir son sens (152 mots, avec leur voix), touche 🔊 pour une phrase, « Listen to the story » pour toute l'histoire (la phrase lue s'allume). Chaque histoire a 2 questions ; « Everything » mélange 10 questions de toutes les histoires.
- **Pied de page et page « About »** (tout en bas de l'accueil) : une petite ligne « Elliniká, a personal project · About this app », avec un lien vers la page **About** : appli faite par toi, pour ton propre but (apprendre le grec), peut-être développée plus tard pour tous ceux qui veulent apprendre le grec ; crédits (voix Athina, Wikisource, Wikiquote, Wikipédia) et une note disant que les textes n'ont pas encore été relus par un locuteur grec. Les textes sont dans `index.html` (section `data-view="about"`), traduits comme les autres. Pour ajouter **ton nom** ou **un moyen de te contacter**, remplis les deux lignes `author` et `contact` en haut de `js/about.js`.
- **Page « About » : développement et contact** : une carte « Still in development » (l'appli est encore en construction) et « Found a bug or a mistake? » invite à signaler tout bug ou toute incohérence en grec, avec un bouton qui ouvre le mail (sujet déjà rempli) et un bouton pour copier l'adresse. L'adresse est dans `js/about.js` (`ABOUT.email`) : si elle change, c'est le seul endroit à modifier ; vide, la carte disparaît.
- **Calendrier des jours fériés de Chypre** (catégorie **Time & dates**, premier jeu « Calendar ») : une grille de chaque mois (lundi en premier, jours en grec), avec une pastille sur les jours fériés. Touche un jour pour lire **en grec pourquoi il est férié** (avec la voix, et le sens en anglais ou en français), et vois en haut le **prochain jour férié** (« σε 55 ημέρες »). Il y a 16 jours fériés (Πρωτοχρονιά, Θεοφάνεια, Καθαρά Δευτέρα, 25 mars, 1er avril, Pâques et les jours autour, Πρωτομαγιά, Δευτέρα του Αγίου Πνεύματος, 15 août, 1er octobre, 28 octobre, Noël et le 26 décembre). Les dates de Pâques sont **calculées** chaque année (Pâques orthodoxe : 12 avril 2026, 2 mai 2027, 16 avril 2028…). La liste suit Wikipédia (« Public holidays in Cyprus ») ; il faut vérifier sur le calendrier officiel. Données dans `data/holidays.js`, code dans `js/calendar.js`.
- **Conversation** : un partenaire qui parle (voix Athina) et à qui tu réponds. **8 situations** : faire connaissance, au café, au restaurant, demander son chemin, au marché, à l'hôtel, chez le médecin, en taxi (A1 à B1, 42 réponses à donner). Deux façons de jouer : **Choose** (3 réponses, une seule convient ; les deux autres expliquent pourquoi elles ne vont pas) et **Write** (tu vois le sens d'une réponse et tu l'écris avec les lettres grecques, avec le clavier grec ; accents et majuscules sans importance). À la fin, tu vois combien de réponses étaient justes du premier coup (✓ sur la conversation quand tout est juste). Chaque réponse compte pour ta progression (catégorie « Conversation »), et les phrases sont aussi dans le dictionnaire. Ce n'est **pas une IA** : les conversations sont écrites à l'avance, donc ça marche hors ligne. Les données sont dans `data/talk.js`, le code dans `js/talk.js`.
- **Mes mots (favoris ⭐)** : un ☆ à côté de chaque mot (cartes des listes de mots, dictionnaire, sous la réponse après un jeu, mots des histoires et des poèmes, mot du jour, Greek letters). Un clic le met en ★. La page **My words** (menu, section Tools) liste tes favoris, te laisse les écouter, les retirer, et lance un jeu rien qu'avec eux. Dans le dictionnaire, le choix « My words » de la liste des catégories n'affiche que tes favoris. Ils sont gardés dans ce navigateur (`gl-fav`) et dans la sauvegarde. Le code est dans `js/favorites.js`.
- **Ton parcours A1 → B2** (page « Review & progress ») : un bloc **Your path** dit sur quel niveau tu travailles (le premier où tu maîtrises moins de 30 % des mots) et propose « Practice A1 words » (lance les mots de ce niveau dans Greek letters), la révision et le test de niveau. Le bloc **By level** montre, pour A1, A2, B1 et B2, les mots pratiqués (barre claire) et maîtrisés (barre foncée). Le **test de niveau** donne maintenant un niveau européen : A0, A1, A2 ou B1 (estimation de ce que l'appli enseigne). Le code est dans `js/levels.js` (`levelStats`, `currentLevel`).
- **Voix lente** : le réglage « Voice speed » (Normale / 🐢 Lente) du panneau ⚙️, disponible sur chaque page, ralentit toutes les voix (vitesse 0,7). Le choix est mémorisé (`gl-slow`). Le code est dans `js/audio.js`.
- **Dictation** (nouveau jeu dans toutes les listes de mots : famille, nourriture, corps, maison, ville…) : tu écoutes un mot et tu l'écris avec les lettres grecques (clavier grec ; accents et majuscules sans importance). Le bouton « Hint » donne le sens.
- **Poems & proverbs** : 4 poèmes dont 2 sur Chypre (🏝️) — *À l'archevêque Kyprianos* de Vasilis Michaelides (le poète national de Chypre ; Kyprianos fut pendu à Nicosie le 9 juillet 1821), *Hymne à la liberté* de Solomos (ses deux premières strophes sont l'hymne de la Grèce et de Chypre), *Ithaque* de Cavafy et le *Thourios* de Rigas Feraios (extraits). Même principe que les histoires : tu touches un mot pour son sens, 🔊 pour un vers, « Listen to the poem » pour tout lire ; le mode « Fill the gap » cache un mot d'un vers. Les textes viennent de Wikisource (poèmes du domaine public), l'orthographe est parfois modernisée. Les poèmes d'auteurs plus récents (Séféris, Elytis, Ritsos, Montis…) sont encore protégés : je ne les ai pas mis.
  Il y a aussi **2 séries de proverbes grecs** (21 proverbes, texte de Wikiquote grec, avec leur sens). Les **histoires** comptent maintenant **5 textes sur Chypre** (🏝️ : Chypre, le rocher d'Aphrodite, les montagnes du Troodos, le halloumi, le dialecte chypriote). Les faits (capitale, langues, 1960, 2004, 2008, Olympe/Χιονίστρα 1 952 m, halloumi, Petra tou Romiou, mots chypriotes) ont été relus sur Wikipédia ; je n'ai pas mis ce que je ne pouvais pas vérifier (la fête du Kataklysmos, l'année de la protection du halloumi).
- **1-minute challenge** : 60 secondes, un maximum de bonnes réponses, avec des mots de toutes les catégories de vocabulaire (4 sortes de questions). Chaque réponse compte aussi pour ta série, ton objectif et tes révisions. Ton meilleur score est gardé.
- **Write by hand** (3e onglet de « Greek letters ») : on te donne le nom d'une lettre, tu la dessines au doigt ou à la souris, et l'appli te dit si ça lui ressemble. Tu peux afficher un modèle en filigrane, ou écrire de mémoire. Ce n'est **pas parfait** : l'appli compare ton dessin à plusieurs polices, et le bouton « I wrote it correctly » te laisse compter la réponse quand tu es sûr. Le code est dans `js/handwriting.js` (le seuil `HW_MAX_DIST` règle la sévérité).
- **Dictionary** : tous les mots de l'application dans une seule liste (noms, verbes, adjectifs, nombres, phrases, lettres…), en deux modes. **Browse** : de A à Ω, avec filtres par type et par catégorie. **Search** : tape en grec, en anglais ou en lettres latines (`kafes`, `coffee`, `καφές`, sans accents si tu veux). Pour un verbe, tu peux même chercher une forme conjuguée (`grapso` trouve γράφω). Touche un mot pour l'entendre ; sur un verbe, « Conjugation » déplie le tableau.
- **Level test** : un test **strict, façon CECRL**, **entièrement en lettres grecques** (consignes et réponses en grec, avec seulement un petit rappel en anglais/français ; le sens n'apparaît qu'après ta réponse). 40 questions en 4 étapes de 10 (A1, A2, B1, B2) : lecture de petits textes, écoute, grammaire, vocabulaire, écriture au clavier grec, conversation. Résultat : A0, A1, A2, B1 ou B2, avec le détail par étape et par compétence et les catégories à travailler. Ton dernier résultat est gardé dans le navigateur.

## Comment l'ouvrir

Double-clique sur **index.html**. C'est tout : pas d'installation, pas de serveur.

## À quoi sert chaque fichier

| Fichier / dossier | Rôle | Quand le modifier |
|---|---|---|
| `index.html` | La structure : le menu et les trois catégories | Pour changer un texte ou ajouter un bouton |
| `css/style.css` | La mise en page de base : tailles, espacements, grilles | Rarement |
| `css/theme.css` | **Le style** : les couleurs de chaque catégorie, les ombres, les coins arrondis, le look sombre et le look clair, les animations | Pour changer les couleurs ou le look |
| `css/submenu.css` | **Les sous-menus** de chaque catégorie : les jeux en grandes tuiles avec une icône (une icône par `data-mode`, la liste est en haut du fichier), les thèmes en petites pastilles avec le nombre de mots, et la phrase d'aide | Pour changer l'icône d'un jeu ou la forme des boutons |
| `css/home.css` | **L'accueil sous le titre et l'image** : la grande carte de progression, les 4 tuiles « Start here », la grille du vocabulaire et les 2 boutons d'outils (une classe `g-banner`, `g-start`, `g-tiles` ou `g-tools` par bloc dans `index.html`) | Pour changer la forme des cartes de l'accueil |
| `js/theme.js` | Le bouton ⚙️ (sur chaque page) : ouvre et ferme le panneau, et choisit le look clair ou sombre | Rarement |
| `data/greek-data.js` | Les mots, phrases et lettres de **Greek letters** | Pour ajouter / corriger des mots |
| `data/colors.js` | Les couleurs, les phrases et les mélanges de **Colors** | Pour ajouter une couleur ou une phrase |
| `data/grammar.js` | Les verbes, les temps et les niveaux de **Grammar** | Pour ajouter un verbe |
| `data/numbers.js` | Les nombres de **Numbers** | Rarement |
| `data/family.js` | Les mots de **Family & animals** | Pour ajouter un mot ou un animal |
| `data/food.js` | Les mots de **Food & drinks** | Pour ajouter un aliment ou une boisson |
| `data/body.js` | Les mots de **Human body** | Pour ajouter un mot du corps |
| `data/time.js` | Les mots de **Time & dates** | Pour ajouter un jour, un mois, un repère de temps |
| `data/house.js`, `data/city.js`, `data/directions.js`, `data/nature.js`, `data/jobs.js` | Les mots de **House & clothes**, **City & travel**, **Directions**, **Weather & nature** et **Jobs & hobbies** (même format que `data/food.js`) | Pour ajouter un mot |
| `data/opposites.js` | Les paires de **Opposites** : chaque mot a un champ `opp`, le grec de son contraire | Pour ajouter une paire (deux lignes, une dans chaque sens) |
| `data/dialogues.js` | Les conversations de **Dialogues** : répliques (`gr`, `lat`, `en`, `fr`), qui parle (`s` : 0 ou 1) et les questions d'écoute | Pour ajouter ou corriger un dialogue |
| `js/dialogues.js` | La catégorie Dialogues : les cinq modes, y compris « Say it » (reconnaissance vocale du navigateur) | Pour changer les jeux de dialogues |
| `data/stories.js` | Les histoires : phrases (`gr`, `lat`, `en`, `fr`), 2 questions par histoire, et la liste `gloss` des mots qu'on peut toucher (`gr` en minuscules sans ponctuation, `en`, `fr`) | Pour ajouter ou corriger une histoire (tout mot d'une phrase doit être dans `gloss`) |
| `js/stories.js` | La catégorie Stories : lecture, mots à toucher, écoute de toute l'histoire, questions | Pour changer l'écran des histoires |
| `data/poems.js` | Les poèmes : `title`, `author`, `years`, `cyprus` (vrai pour les poèmes sur Chypre), `about`, les vers (`gr`, `lat`, `en`, `fr`, `end` à la fin d'une strophe) et la liste `gloss` des mots à toucher | Pour ajouter un poème (tout mot d'un vers doit être dans `gloss`, ou dans celui des histoires) |
| `js/poems.js` | La catégorie Poems : lecture, mots à toucher, écoute, mot manquant | Pour changer l'écran des poèmes |
| `js/challenge.js` | Le défi d'une minute | Pour changer sa durée (`CH_SECONDS`) ou ses questions |
| `js/handwriting.js` | L'onglet « Write by hand » : dessin, reconnaissance, résultat | Pour régler la reconnaissance des lettres |
| `js/today.js`, `js/backup.js` | La carte « Aujourd'hui » de l'accueil ; la sauvegarde et la restauration de la progression | Rarement |
| `css/extras.css` | Le style des histoires, du défi et de l'écriture à la main | Pour changer leur look |
| `data/phrases.js` | Les phrases de **Phrases** (grec, anglais, français) | Pour ajouter ou corriger une phrase |
| `data/grammar2.js` | Les données des cinq sujets de grammaire (pluriel, adjectifs, cas, négation, questions), avec le sens en anglais et en français | Pour ajouter un exemple |
| `data/fr.js` | **Tous les textes français** : une ligne par texte anglais (voir « Le français » plus bas) | Pour corriger ou ajouter une traduction |
| `audio/` | Un fichier MP3 par texte grec de l'application | Rempli par le script, pas à la main |
| `tools/make_audio.py` | Le script qui fabrique les MP3 avec la voix Athina | Quand tu ajoutes des textes grecs |
| `js/router.js` | Le menu et la navigation entre catégories | Rarement |
| `js/quiz.js` | Le « moteur de jeu » commun à Colors et Grammar (10 questions, score, meilleur score) | Pour changer le déroulé des jeux |
| `js/colors.js` | La catégorie Colors : modes et questions | Pour changer ou ajouter un jeu de couleurs |
| `js/grammar.js` | La catégorie Grammar : niveaux, tableaux, questions | Pour changer la grammaire |
| `js/numbers.js` | La catégorie Numbers : niveaux, jeux, additions | Pour changer les jeux de nombres |
| `js/vocab.js` | Le moteur des catégories « liste de mots avec images » (utilisé par Family & animals, Food & drinks, Human body, Time & dates, House & clothes, City & travel, Directions, Weather & nature, Jobs & hobbies et Opposites) | Pour changer ses jeux, ou créer une catégorie du même type |
| `js/audio.js` | Lecture des fichiers MP3 | Rarement |
| `js/transliteration.js` | Les règles grec → lettres latines (ου = ou, μπ = b…) | Pour ajuster les orthographes acceptées |
| `js/practice.js`, `js/alphabet.js` | Les deux onglets de Greek letters | Pour changer l'exercice ou les cartes |
| `data/grammar3.js`, `js/grammar3.js` | Les 3 thèmes de grammaire **Prepositions**, **Possessives**, **Imperative** (phrases à trou : `say`, `blank`, `answer`, `en`, `fr`) | Pour ajouter une phrase ou un thème du même type |
| `data/holidays.js`, `js/calendar.js` | Le calendrier des jours fériés de Chypre : règle de date (`m-d` ou `e<n>` = n jours après Pâques orthodoxe), nom, explication en grec / anglais / français | Pour corriger un jour férié ou une explication |
| `data/talk.js`, `js/talk.js` | Les conversations : scénarios, tours du partenaire (`bot`), bonnes réponses (`good`) et mauvaises (`bad` avec la raison) ; et l'écran de conversation | Pour ajouter ou corriger une conversation |
| `js/favorites.js` | Les favoris ⭐ : le bouton `favButton`, la page « My words » et son jeu | Pour changer les favoris |
| `js/difficulties.js` | La page « My difficulties » : liste, filtre par catégorie, jeu | Pour changer le carnet d'erreurs (`DIF_SHOWN` = mots montrés d'abord) |
| `js/clock.js` | Les jeux d'horloge de Time & dates (« Read the clock », « Hear the time ») ; dessine l'horloge | Pour changer les jeux d'heure |
| `data/clock.js` | Les 144 heures dites en grec (de 1 h à 12 h, toutes les 5 minutes) | Pour changer la façon de dire l'heure |
| `data/money.js` | Les mots des prix (ευρώ, λεπτά, και…) pour les jeux de prix de Numbers | Rarement |
| `js/sounds.js` + `data/sounds.js` | Les sujets de grammaire « Accents » et « Spelling » (faits à partir des mots de l'appli) et les paires de mots qui ne changent que d'accent | Pour changer ces deux sujets |
| `js/map.js` + `data/geo.js` | Les cartes simplifiées de Chypre et de la Grèce (mode « Map » de City & travel) et les jeux « Where is it? » / « Hear the place » | Pour ajouter un lieu : une ligne dans `data/geo.js` |
| `js/mascot.js` + `css/mascot.css` | La chouette qui réagit aux réponses et aux scores (`mascot(humeur, taille)`) | Pour changer son dessin ou ses humeurs |
| `js/strokes.js` | Le tracé des lettres (ordre et sens des traits) pour « Show how to write it » dans Write by hand | Pour corriger le tracé d'une lettre |
| `data/greetings.js` | Les vœux des fêtes (Pâques, Noël, Nouvel An, Épiphanie, fêtes nationales) | Pour changer les vœux |
| `css/motion.css` | Les écrans de jeu et les animations : pastilles de la question, barre qui brille, réponses qui arrivent une à une, panneau vert/rouge de la réponse, anneau de score avec étoiles et confettis, tuiles du menu. Chargé en dernier ; tout ce qui bouge s'arrête si l'appareil demande « réduire les animations » | Pour changer le mouvement ou la forme des jeux |
| `js/homeui.js` + `css/homeux.css` | Le confort du menu : barre de recherche de l'accueil, rangée « Recently », barre du bas sur téléphone (Home, Learn, Practice, Dictionary, More) et la feuille « More » avec toutes les pages | Pour changer ces éléments |
| `js/ambient.js` + `css/ambient.css` | La vie dans le paysage : vagues, bateau, soleil/lune, œil bleu, moulin, oiseaux, nuages, étoiles ; le ciel qui suit l'heure ; les collines qui glissent au défilement ; la surprise au toucher ; la vague et la frise grecque en bas de l'accueil | Pour changer ou couper les animations du paysage |
| `js/texts.js` + `data/texts.js` | La catégorie « Texts » : fables, mythes, légende, poèmes célèbres de Cavafy, Notre Père ; lecture mot à mot, jeu « Fill the gap », liens vers des vidéos et des documents | Pour ajouter un texte : un bloc dans `data/texts.js` (voir le commentaire du haut) |
| `js/garments.js` + `data/clothes.js` | La catégorie « Clothes » : 39 vêtements pour hommes, femmes et bébés, chacun avec un dessin SVG (`svg` = nom du dessin, `color` = couleur) | Pour ajouter un vêtement : une ligne dans `data/clothes.js` et, si besoin, un dessin dans `GARMENTS` |
| `js/levels.js` | Les niveaux A1–B2 : la liste des niveaux et le niveau par catégorie / groupe (utilisés par le dictionnaire) | Pour changer le niveau d'une catégorie |
| `js/bodydiagram.js` | **Les dessins** du corps humain (formes SVG, numéros, zones à toucher) | Pour changer un dessin ou en ajouter un |
| `js/phrases.js` | La catégorie Phrases : les cinq modes | Pour changer les jeux de phrases |
| `js/dictionary.js` | La catégorie Dictionary : elle se construit toute seule à partir des fichiers de `data/` | Pour changer la recherche ou les filtres |
| `js/leveltest.js` | La catégorie Level test : les 40 questions, le calcul du niveau, l'écran de résultat | Pour changer les questions ou les seuils de niveau |
| `data/levelq.js` | Les phrases à trous, textes à lire et définitions du test de niveau (20 + 5 + 8, par niveau) | Pour ajouter des questions de lecture |
| `js/grammar2.js` | Les cinq sujets de grammaire en plus des verbes : pages Learn, jeux Choose et Write | Pour changer ces jeux |
| `js/i18n.js` | La langue : `tx("texte anglais")` donne le texte français quand FR est choisi ; le choix English / Français du panneau ⚙️ | Rarement |
| `js/progress.js` | La mémoire des mots travaillés et le calendrier de révision (stockés dans le navigateur) | Pour changer les délais de révision (`INTERVALS`) |
| `js/progressview.js` | La page Review & progress et le jeu de révision | Pour changer la page ou la taille d'une révision (`REVIEW_SIZE`) |
| `js/helpers.js`, `js/main.js` | Petits outils, onglets, démarrage | Rarement |
| `original/` | Ta version d'origine, intacte (sauvegarde) | Jamais |

L'ordre des `<script>` à la fin de `index.html` compte : ne le change pas.

## Le français

Chaque texte de l'application est écrit en anglais dans le code et passe par `tx("…")`. Quand le français est choisi, `tx` cherche ce texte dans `data/fr.js` : une ligne par texte, `"Check": "Vérifier",`. Un texte sans ligne reste en anglais, rien ne plante.

- **Corriger une traduction** : cherche le texte anglais dans `data/fr.js` et change la partie française.
- **Un nouveau mot dans un fichier de `data/`** : ajoute une ligne dans `data/fr.js` avec le sens anglais exactement comme dans le fichier de données (`"hare": "lièvre",`). Les phrases de `data/phrases.js` et les exemples de `data/grammar2.js` ont déjà leur champ `"fr"`, pas besoin de ligne.
- **Les traductions entre `{…}`** (`"in {n} days": "dans {n} jours"`) : garde les `{n}` tels quels, l'appli les remplace.
- **Le dictionnaire cherche dans les deux langues** : `coffee` et `café` trouvent tous les deux καφές, quelle que soit la langue de l'écran.
- Les traductions ont été écrites par l'assistant, pas par un locuteur natif : relis-les, elles sont faciles à corriger dans `data/fr.js`.

## Changer les couleurs et le look

Tout est dans `css/theme.css` (chargé après `style.css`, donc il a le dernier mot).

- **Chaque catégorie a sa couleur**, en haut du fichier (`body[data-view="colors"] {--cat:#C4546B}` en sombre). Change le code couleur et la catégorie entière change : boutons, puces, barre de progression, cartes. Pour l'accueil, la même couleur est répétée plus bas (`.cat[data-go="colors"]`).
- **Le look sombre est celui par défaut** (fond presque noir). Dans le panneau ⚙️ (en haut à droite de chaque page), les boutons ☀️ Clair / 🌙 Sombre changent le look (le clair a un fond crème) ; ton choix est mémorisé. Les couleurs de base (fond, texte, cartes) sont dans les deux premiers blocs de `theme.css` : le premier pour le sombre, le second (`data-theme="light"`) pour le clair.
- **Les couleurs de catégorie ont deux versions** : plus lumineuses en sombre (pour ressortir sur le noir), plus profondes en clair. Elles sont répétées pour l'accueil (`.cat[data-go="colors"]`).
- **La forme** : `--radius` (arrondi des cartes) et `--shadow` (ombres) en haut du fichier.
- **Les animations** (apparition des écrans, bonne réponse qui « pulse », mauvaise qui « tremble ») se coupent d'elles-mêmes pour les personnes qui ont réglé leur appareil sur « réduire les animations ».

## Le décor du haut de page

- **Le titre** de chaque page prend la couleur de sa catégorie (sur l'accueil, « GREEK TRAINER » est doré et « Ελληνικά » bleu égéen ; ces deux couleurs sont `.hero-kicker` et `.hero-title` dans `css/theme.css`, avec une version plus foncée pour le look clair).
- **Le paysage** : un petit paysage grec dessiné en SVG derrière le haut de chaque page (soleil, mer, village blanc aux dômes bleus, moulin à vent, olivier, cyprès, voilier, mauvais œil bleu). Il est dans `index.html` (`<svg class="scene">`) et ses couleurs dans `css/theme.css` (`.deco`). Il prend la teinte de la catégorie et suit le look sombre ou clair. Il est bien visible sur l'accueil et très discret sur les autres pages, pour ne pas gêner la lecture.
- **La barre du haut** ne contient plus que le bouton ←, le titre, le score (dans Greek letters) et le bouton ⚙️. Les petits autocollants ronds et le bouton 🐢 ont été retirés (la voix lente reste dans le panneau ⚙️).
- **La barre du haut** reste transparente tant que tu es en haut de la page, et devient « givrée » dès que tu fais défiler.

## Orthographe acceptée quand on tape

Quand tu écris un mot en lettres latines, l'application est tolérante : `ch` ou `h` pour χ, `i` ou `y` pour υ, `b` ou `v` pour β… Les **consonnes doubles** (ββ, κκ, λλ, νν…) se disent comme une seule : `savato` et `savvato` sont tous les deux acceptés pour σάββατο, `kokino` et `kokkino` pour κόκκινο. Les règles sont dans `js/transliteration.js`.

## Modifier les dessins du corps

Dans `js/bodydiagram.js`, `BODY_DIAGRAMS` contient les sept dessins (devant, **dos**, visage, main, pied, organes, squelette). Chaque dessin a une liste `parts` : une ligne par partie à toucher.

```
{gr:"το μάτι", z:5, dot:[130,153], fill:"#FFFFFF", shapes:[ell(100,154,17,9), ell(160,154,17,9)]}
```

- `gr` : le mot grec (le même que dans `data/body.js`).
- `shapes` : les formes à dessiner, avec `ell(x, y, largeur, hauteur)` pour une ellipse, `box(x, y, largeur, hauteur, arrondi)` pour un rectangle et `cap(x1, y1, x2, y2, épaisseur)` pour une barre arrondie (bras, doigt, os).
- `dot` : la position du numéro. `fill` : la couleur (facultatif). `z` : plus il est grand, plus la forme est dessinée par-dessus les autres.
- `zoom` : un `id` de dessin (`"face"`, `"hand"`, `"foot"`, `"inside"`, `"skeleton"`) pour afficher un bouton de zoom quand on touche la partie.

Les coordonnées sont celles de `viewBox` du dessin (par exemple `0 0 260 490` : 260 de large, 490 de haut). Le numéro d'une partie est sa place dans la liste.

## Le test de niveau : comment le niveau est calculé

Les 40 questions forment 4 étapes de 10 : A1, A2, B1, B2. Tu atteins un niveau seulement si tu as **au moins 7 bonnes réponses sur 10** dans son étape **et** dans toutes les étapes d'avant (comme un vrai examen : on ne saute pas un niveau). Résultats possibles : A0 (sous A1), A1, A2, B1, B2. Les anciens résultats (échelle de 0 à 5) sont ignorés car `lastTest()` exige `v:2`. Les textes des niveaux sont en haut de `js/leveltest.js` (`TEST_LEVELS`), les questions dans `TEST`, les phrases et textes dans `data/levelq.js`. Le test ne mesure que ce que l'application enseigne et tout est écrit par Claude : c'est une estimation, pas un diplôme.

## Fabriquer les MP3 (voix grecque Athina)

Le script `tools/make_audio.py` fabrique un MP3 pour chaque texte grec des dix fichiers de `data/` (mots, noms de lettres, couleurs, phrases, formes des verbes) avec la voix **el-GR-AthinaNeural**. Tout est déjà dans `audio/`. Tu n'as besoin de relancer le script que si tu ajoutes ou changes des textes grecs.

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
- **Une phrase** : dans `data/phrases.js`, copie une ligne : `{"gr": "Βρέχει.", "lat": "vrechei", "en": "It is raining.", "fr": "Il pleut."}`. Si la phrase peut s'écrire autrement, ajoute `"alt": ["autre façon"]` : toutes les versions seront acceptées quand tu écris.
- **Un mot de maison, de ville, de nature, de métier ou de contraire** : dans `data/house.js`, `data/city.js`, `data/directions.js`, `data/nature.js`, `data/jobs.js` ou `data/opposites.js`, copie une ligne (même format que `data/food.js`). Dans `data/opposites.js`, chaque mot a un champ `"opp"` : le grec de son contraire. Ajoute donc **deux lignes**, une dans chaque sens, dans le même groupe.
- **Une réplique ou un dialogue** : dans `data/dialogues.js`, ajoute une ligne dans `"lines"` (`"s"` vaut 0 ou 1 : qui parle). Pour un nouveau dialogue, copie un bloc entier avec son `id`, son `name`, ses deux `roles`, ses `lines` et ses `quiz` (une question, la bonne réponse `ok` et trois mauvaises `bad`, en anglais et en français).
- **Un mot de temps** : dans `data/time.js`, copie une ligne. Un nom commence par son ο, η ou το (`o minas`) ; un adverbe n'en a pas (`πάντα`, `ποτέ`).
- **Un mot du corps** : dans `data/body.js`, copie une ligne (`gr` avec son ο, η, το, τα ou οι). Il apparaît dans les listes et les jeux. Pour qu'il apparaisse aussi **sur un dessin**, ajoute une ligne dans la liste `parts` du dessin concerné dans `js/bodydiagram.js` (voir plus bas).
- **Un nombre** : dans `data/numbers.js`, les nombres de 21 à 99 sont fabriqués par l'application (dizaine + unité, par exemple 35 = τριάντα πέντε) avec les sons déjà là. Tu n'ajoutes rien pour eux.
- **Un verbe** : dans `data/grammar.js`, copie un bloc de `"verbs"`. Il faut 6 formes par temps, dans l'ordre : je, tu, il/elle, nous, vous, ils/elles. Puis ajoute son `id` dans la liste `"verbs"` d'un niveau de `"levels"` pour qu'il apparaisse.

## Refaire tous les sons (autre voix, autre vitesse)

Change `VOICE` ou `RATE` en haut de `tools/make_audio.py`, puis :

```bash
python tools/make_audio.py --force
```

## Les écrans de jeu

Chaque jeu utilise `runQuiz` (`js/quiz.js`). En haut : la question, le score, la série de bonnes réponses (🔥 ×3 à partir de 2) et la meilleure note. Après chaque réponse, un panneau vert ou rouge montre la correction. À la fin, `scoreCard(score,total,message,détail)` dessine l'écran de résultat commun (anneau qui se remplit, 1 à 3 étoiles selon le pourcentage, confettis à partir de 90 %) et `celebrate(box,score,total)` lance le compteur et les confettis. Pour un nouveau jeu, appelle ces deux fonctions dans `renderResult`.

## L'accueil, par intention

Sous le paysage, l'accueil est rangé en blocs : **la recherche** (tape un mot : les 5 premiers résultats s'affichent tout de suite, touche-en un pour l'écouter ou ⭐, « Open in the dictionary » ouvre le dictionnaire avec ta recherche), **Today**, **Recently** (les 3 dernières pages ouvertes, gardées dans `gl-recent`), **Practice now** (progression, défi d'une minute, difficultés, mes mots, conversation), **Learn** (lettres, phrases, dialogues, histoires, poèmes, grammaire), **Vocabulary** (12 petites tuiles, nom seulement) et **Tools** (dictionnaire, test de niveau). Pour ajouter une page : copie une tuile `<button class="cat" data-go="...">` dans le bon bloc de `index.html` ; la feuille « More » et la rangée « Recently » la prennent toutes seules.

Sur téléphone (écran de moins de 760 px), une **barre en bas** donne : Home, Learn et Practice (qui font défiler l'accueil jusqu'au bloc), Dictionary, et More (la liste de toutes les pages). Elle se cache quand tu écris dans une case, pour laisser la place au clavier. Sur grand écran, elle n'existe pas : les tuiles sont plus larges (6 par rangée pour le vocabulaire).

## Le paysage vivant (accueil)

Le dessin du haut de l'accueil (dans `index.html`, balise `<svg class="scene">`) bouge doucement : les vagues glissent, le bateau tangue, le halo du soleil respire, l'œil bleu se balance, les ailes du moulin tournent, des oiseaux et des nuages passent. En **mode sombre**, c'est une nuit : étoiles qui scintillent et lune à la place du soleil. En **mode clair**, c'est un jour avec des nuages. Le **ciel suit l'heure** de ton appareil (aube 5-8 h, jour 8-17 h, soir 17-20 h, nuit) : `js/ambient.js` écrit `data-tod` sur la page et `css/ambient.css` choisit la teinte ; en mode clair le soleil est plus bas le matin et le soir. Les collines glissent un peu quand tu défiles (variable `--sy`).

**Surprise** : touche le bateau (« Καλό ταξίδι! »), l'œil bleu (« Καλή επιτυχία! »), le moulin (« Καλημέρα! ») ou le soleil/la lune (« Καλημέρα! » le jour, « Καληνύχτα! » la nuit) : l'élément réagit et la voix dit le souhait. Les phrases sont dans `WISHES` (`js/ambient.js`) ; seules celles qui ont déjà un enregistrement sont utilisées. Sur un téléphone étroit, seule la partie droite du dessin est visible (bateau, soleil, village), l'œil et le moulin apparaissent sur un écran plus large.

En bas de l'accueil, une double vague et une **frise grecque** (« clé grecque ») décorent la fin de la page. Tout s'arrête si l'appareil demande « réduire les animations ».

## Ce qui a été ajouté en dernier (nouveautés)

- **+250 entrées** : 53 verbes (conjugaison au présent, passé, futur ; niveaux 13 à 18 de Grammar > Verbs) et 197 mots de vocabulaire (Greek letters, maintenant 1179 mots, avec niveaux A1–B2 et traductions). Le vocabulaire est écrit par Claude, sans relecture par un Grec.
- **Verbs > Write it** : on te donne un verbe, un temps et une personne, tu écris la forme avec le clavier grec (indice : début et fin du mot).
- **Time & dates > Read the clock / Hear the time** : une horloge dessinée ; on dit l'heure en grec (« Είναι δύο και μισή », « τρεις παρά τέταρτο »).
- **Numbers > Prices / Hear the price** : des prix en euros (3,50 € = τρία ευρώ και πενήντα λεπτά) ; l'audio enchaîne les mots des nombres.
- **Grammar > Accents** (écouter un mot, choisir où va l'accent) et **Grammar > Spelling** (ι η υ ει οι, ο ω, ε αι : choisir ou écrire la bonne orthographe).
- **City & travel > Map** : cartes de Chypre et de la Grèce (touche un lieu : nom + phrase en grec), et deux jeux « Where is it? » / « Hear the place ». Les contours sont simples et dessinés à la main ; les lieux sont aux bons endroits.
- **Décors de fête** : autour de Pâques (bougies, œufs rouges), de Noël au 6 janvier (neige, guirlande, étoile), et aux fêtes nationales (drapeau grec le 25 mars et le 28 octobre, drapeau chypriote le 1er avril et le 1er octobre). Une bannière avec le vœu en grec apparaît sous la recherche. Pour les voir quand ce n'est pas la fête : ajoute `?fest=easter`, `?fest=xmas`, `?fest=gr` ou `?fest=cy` à l'adresse (par exemple `index.html?fest=xmas`). Réglage ⚙️ « Festive scenery » : Auto / Off.
- **La chouette** : elle réagit à chaque réponse (contente, désolée, en fête après 3 bonnes réponses d'affilée) et sur l'écran de résultat.
- **Écrire à la main > Show how to write it** : les traits de la lettre se dessinent un par un, avec le numéro de départ. C'est un tracé simple, pas une police.
- **⚙️ Réglages** : taille du texte (3 tailles), « Easy-read » (police simple, plus d'espace entre lettres, mots et lignes), décor de fête. Ces réglages sont gardés (`gl-size`, `gl-ease`, `gl-fest`) et font partie de la sauvegarde.

## Conversations (28) et Textes

- **Conversation** : maintenant **28 situations**, de A1 à B2 (5 en A1, 13 en A2, 6 en B1, 4 en B2 ; 20 sont nouvelles) ; des boutons de niveau (All levels, A1…B2) filtrent la liste. Elles sont dans `data/talk.js` (le haut du fichier explique le format : une réplique du partenaire, 2 bonnes réponses et 2 mauvaises avec la raison).
- **Texts** (menu Learn, 📜) : 11 récits (4 fables d'Ésope, 6 mythes, 1 légende) racontés **en grec simple pour cette appli** (les histoires sont traditionnelles, le texte est de Claude) et 5 textes **recopiés de Wikisource grec** (domaine public) : quatre poèmes de Cavafy (« Τείχη », « Τα παράθυρα », « Η πόλις », « Περιμένοντας τους βαρβάρους ») et le « Πάτερ ημών ». L'orthographe a été passée au système moderne à un seul accent. Chaque texte se lit ligne par ligne (🔊 par ligne, ou le texte entier), on peut toucher un mot pour son sens (`TEXTS.gloss`, puis les mots des poèmes, des histoires et le dictionnaire), et il y a le jeu « Fill the gap ».
- **Liens** : sous chaque texte, des vidéos YouTube et des pages (Wikisource, Wikipédia) qui s'ouvrent sur internet. Pour chaque vidéo, j'ai vérifié que l'adresse existe (titre et chaîne donnés par YouTube) ; je n'ai pas regardé les vidéos en entier. Une vidéo peut disparaître un jour : dans ce cas, supprime la ligne dans `links` de `data/texts.js`. Les poèmes « Ύμνος εις την Ελευθερίαν » (hymne national) et « Ιθάκη » de la page « Poems & proverbs » ont aussi leurs liens (`poemLinks`). En bas de la page Texts : trois vidéos de danses traditionnelles de Chypre (`traditions`).

## Vêtements (Clothes)

Dans Vocabulaire : 3 groupes (For men 15, For women 13, For babies 11) avec les mêmes jeux que les autres catégories (Learn, Greek → English, English → Greek, Picture, Listen, Write it, Dictation, ο / η / το). Les images sont des dessins SVG simples faits à la main dans `js/garments.js` (chaque forme a un rôle : couleur principale, partie plus sombre, détail clair, bouton, trait fin). Pour changer la couleur d'un vêtement, modifie `color` dans `data/clothes.js`.

## Derniers ajouts : lecture, questions, grec de Chypre, dessins, relecture

- **Texts** : maintenant **23 textes** (4+2 fables en plus, mythes Prométhée et Orphée, 3 textes de culture : le café grec, la fête du prénom, Pâques en Grèce). Nouveau mode **Questions** : on lit le texte (en haut) puis on répond à 2 questions en grec (`qs` de chaque texte dans `data/texts.js`). Nouveau type « Culture ». Chaque mot touché d'un texte, d'un poème ou d'une histoire a un bouton **➕ Add to my difficulties** qui l'ajoute à « My difficulties » (le mot a déjà son enregistrement).
- **Cypriot Greek** (Learn, 🇨🇾 `js/cypriot.js`, `data/cypriot.js`) : 21 mots chypriotes à côté du mot standard, avec 2 jeux. Les formes sont **recopiées de Wikipédia** (pages « Cypriot Greek » et « Κυπριακή διάλεκτος ») ; quand la page ne donne qu'une glose en grec, le sens est traduit par Claude. La voix lit ces mots avec une prononciation standard, pas chypriote. À faire relire par un Chypriote.
- **Dessins** : 19 objets de la maison (table, canapé, armoire, bureau, tapis, rideaux, oreiller, frigo, four, lave-linge, verre, tasse, casserole, bol, robinet, baignoire, étagère, escalier, horloge) ont maintenant un dessin SVG dans « House & clothes » (champs `svg` et `color` de `data/house.js`).
- **Relecture** : le fichier `relecture-grec.html` (à la racine) rassemble tout le grec écrit par Claude (950 lignes : mots, verbes, conversations, récits, vêtements, cartes, grec de Chypre), avec une colonne « OK / à corriger » : tu peux l'envoyer ou l'imprimer pour un locuteur natif. Pour le refaire après des changements : le script est dans les notes de session (non conservé) ; sinon reprends le principe : une ligne de tableau par texte grec.

## Cuisine (Cooking) et jeux de mots (Word games)

- **Cooking** (Learn, 🍳 `data/cooking.js`) : 67 mots en 5 groupes (ingrédients, ustensiles, gestes de cuisine, quantités, goût et état), avec les mêmes jeux que les autres catégories. Les mots déjà présents ailleurs (sel, huile, tomate…) ne sont pas répétés. Le bouton **Read the recipes** ouvre les **8 recettes** de `data/recipes.js` (salade grecque, café grec, yaourt au miel, halloumi grillé, tzatziki, pommes de terre au citron, strapatsada, moussaka), qui sont des textes du type « Recipes » de la page Texts (lecture avec voix, mots à toucher, texte à trous, questions). Elles sont écrites par Claude en grec simple (« on coupe, on ajoute… »), sans livre : les quantités sont à vérifier avant de cuisiner, et le grec est à faire relire.
- **Word games** (Practice, 🔤 `js/wordgames.js`) : **pendu** (5 mots, 6 erreurs, indice qui coûte une vie ; le dessin est un SVG animé : la potence se construit toute seule, chaque erreur ajoute une partie du bonhomme qui se balance au bout de sa corde, le visage devient inquiet puis des yeux en croix si on perd ; si on gagne, la corde disparaît et un petit héros saute de joie. Le code est `wgGallows()` dans `js/wordgames.js`, le style `.hm-*` dans `css/extras.css`), **mots mêlés** (grille 8×8, 6 mots ; touche la première et la dernière lettre, ou fais glisser le doigt ; option « Meanings only »), **mots croisés** (grille faite à la volée, indices = sens, clavier grec à l'écran, boutons Check / Reveal a letter / Reveal the word). Les mots viennent du dictionnaire de l'appli (noms, adjectifs, verbes d'un seul mot), par thème. Les accents ne comptent pas. Chaque mot trouvé ou raté est noté dans Progress comme dans les autres jeux. Au clavier d'un ordinateur, on peut taper les lettres grecques.
- Jauge des voix : `python tools/audio_gauge.py` affiche une barre qui se met à jour toute seule et dit combien de sons restent à faire.
- **Plus de mots pour les jeux** : `data/wordbank.js` ajoute 290 mots (poissons, oiseaux, insectes, fleurs, arbres, plats et douceurs grecs, objets, métiers, lieux de la ville, parties du corps, vêtements, couleurs, moments du jour). Ils apparaissent aussi dans le dictionnaire. Un mot qui existait déjà seulement dans « Greek letters » reçoit juste un thème en plus (c'est ainsi que les jeux le trouvent par thème). Le français est écrit dans le fichier (`fr`). Pour en ajouter : une ligne `{"gr":..., "lat":..., "en":..., "fr":..., "cat":...}` ; `cat` doit être un nom de catégorie existant (Food & drinks, Family & animals…). Les sons sont à générer avec `python tools/make_audio.py`.

## Schémas dessinés (Outfits, Rooms, œil, bouche, oreille)

- **Où** : dans la catégorie **Clothes** (mode « Outfits » : un homme, une femme et un bébé habillés, avec chaque vêtement numéroté), dans **House & clothes** (mode « Rooms » : une maison coupée en deux avec 18 éléments, et une table de cuisine avec 12 objets) et dans **Human body** (trois nouveaux dessins : **Eye**, **Mouth**, **Ear**, atteints aussi par le bouton 🔍 de la fiche « Face »).
- **Comment ça marche** : c'est le même moteur que les schémas du corps (`js/bodydiagram.js`, fonction `renderDiagramSet`) : chaque partie est numérotée et touchable, elle trouve son mot par son texte grec, et la liste des mots est à côté. La différence : ici chaque forme a ses propres couleurs, ombres et détails (`js/scenes.js`, objet `SC` = petits outils pour dessiner : dégradés `SC.g`, contours `SC.p/e/r`, plis `SC.l`, symétrie `SC.mir`). Un dessin avec `rich:true` garde ses couleurs ; la partie choisie brille au lieu de changer de contour.
- **Les mots** : les parties utilisent les mots déjà dans `data/clothes.js`, `data/house.js`, `data/body.js` et `data/wordbank.js` ; les 18 qui n'existaient pas (cheminée, biberon, hochet, iris, pupille, gencive, palais, incisive, canine, molaire, amygdales, lobe, pavillon, conduit auditif, tympan, cochlée, nerf auditif, blanc de l'œil) sont dans `data/scenes.js` (français inclus). Ils sont aussi dans le dictionnaire.
- **Ajouter un dessin** : écrire un objet comme `SC_EYE` (viewBox, `under` pour le fond et les dégradés, `parts` avec `gr`, `z`, `dot`, `shapes`), le passer par `SC.scope(objet, "préfixe")` (pour que les noms des dégradés restent uniques) et l'ajouter à la liste (`CLOTHES_DIAGRAMS`, `HOUSE_DIAGRAMS` ou `BODY_DIAGRAMS`).
- **Limite** : ces dessins sont faits à la main par Claude, à l'écran ils sont réalistes mais pas des illustrations de professionnel ; certains petits détails (boutons, plis) sont à peine visibles sur un téléphone.

### Autres schémas (transports, famille, nature, métiers)

- **City & travel** : le mode « Map & drawings » a deux boutons : **Map** (la carte) et **Drawings** (une rue avec bus, taxi, banque, église…, une **voiture** de profil, la voiture **de face** et un **avion**).
- **Family & animals** : « Family tree » : un arbre généalogique avec 12 personnages (grands-parents, parents, oncle, tante, cousins, frère, sœur, moi et mon fils).
- **Weather & nature** : « Landscapes » : un paysage (montagne, rivière, lac, forêt, pont…) et une plage (phare, voilier, parasol, pêcheur…).
- **Jobs & hobbies** : « At work » : douze métiers, chacun avec son costume et son outil.
- Au total **23 dessins et 264 parties numérotées** (`js/scenes.js`), avec 38 mots à eux dans `data/scenes.js`. Les parties retrouvent leurs mots dans toutes les listes de l'appli (corps, vêtements, maison, famille, ville, directions, nature, métiers, `data/wordbank.js`).

### Encore des schémas (météo, voiture, directions, nourriture, temps)

- **Weather & nature → « Landscapes »** : un 3ᵉ dessin, **Weather** : six météos (soleil, pluie et arc-en-ciel, orage avec éclair, tonnerre et grêle, neige et glaçons, vent et brouillard, nuit avec lune et étoiles), plus les thermomètres (chaud / froid).
- **City & travel → Drawings** : un 4ᵉ dessin, **Inside the car** (pare-brise, rétroviseur, tableau de bord, compteur, volant, klaxon, radio, aération, levier de vitesses, frein à main, pédales, siège, ceinture).
- **Directions → « Drawings »** : **Crossroads** (un carrefour vu d'en haut avec boussole N S E W, passage piéton, trottoir, virage, pont, autoroute et sortie, rue piétonne, panneau, destination) et **Where is the ball?** (neuf endroits pour une balle : dessus, dessous, dedans, dehors, à côté, devant, derrière, entre, en face).
- **Food & drinks → « Market & table »** : un étal de marché (8 fruits, 8 légumes) et une table de taverne grecque (pain, feta, olives, salade, tzatziki, moussaka, souvlaki, vin, eau, ouzo, miel).
- **Time & dates → « Drawings »** : **The day** (matin, midi, après-midi, soir, nuit, avec des horloges), **The seasons** (quatre arbres) et **The week** (sept cartes, le week-end en jaune).
- Total : **32 dessins et 363 parties numérotées**. 47 mots à eux dans `data/scenes.js`.

### Nombres, couleurs, alphabet et corps détaillé

- **Numbers → « Drawings »** : **Counting** (douze cartes, de 0 à 11, avec le bon nombre de formes à compter) et **The tens** (dix barres : 10, 20 … 100).
- **Colors → « Drawings »** : **Palette** (une palette de peintre avec les 18 couleurs) et **Crayons** (deux boîtes de crayons).
- **Greek letters → onglet « Alphabet »** : un **tableau de l'alphabet** en haut de la page : 24 cartes numérotées dans l'ordre, voyelles en jaune et consonnes en bleu, avec la prononciation ; toucher une carte donne le nom de la lettre avec sa voix.
- **Human body** : 5 nouveaux dessins détaillés : **Heart** (cœur, aorte, artère, veine, valve, muscle, sang), **Lungs** (larynx, trachée, bronches, poumons, cœur, côtes, diaphragme), **Digestion** (bouche, œsophage, foie, estomac, pancréas, intestin grêle, gros intestin), **Tooth** (émail, dentine, pulpe, racine, gencive, nerf, mâchoire) et **Brain** (crâne, cerveau, cervelet, moelle épinière, colonne, nerfs).
- Total : **42 dessins et 479 parties numérotées**, 63 mots à eux dans `data/scenes.js`. Les lettres de l'alphabet gardent leur propre son (champ `snd`, fonction `sayWord`).

### L'argent et la grammaire en images

- **City & travel → Drawings** : deux dessins en plus : **Euro money** (pièces de 1 c à 2 €, billets de 5 à 50 €, portefeuille, carte, liasse, symbole €) et **At the till** (un magasin : caissier, caisse, ticket, monnaie rendue, panier, sac, cadeau, étiquette de prix et de solde).
- **Grammar → sujet « Drawings »** (dernier bouton de la ligne des sujets) : cinq tableaux : **The (articles)** (ο / η / το / οι / τα avec un homme, une femme, un enfant), **The cases** (un vrai tableau : ο φίλος, τον φίλο, του φίλου, φίλε… pour le masculin, le féminin et le neutre), **To be** (είμαι à toutes les personnes), **Past, present, future** (έγραψα / γράφω / θα γράψω, avec χθες / σήμερα / αύριο) et **Question words** (τι, ποιος, πού, πότε, γιατί, πώς, πόσο).
- Total : **49 dessins et 531 parties numérotées**, 96 mots à eux dans `data/scenes.js` (les formes de grammaire sont des mots à part, avec leur voix).

## Plus de grammaire (le génitif, « Quel cas ? », verbes et prépositions en images)

- **Grammar → Genitive** (`js/grammar4.js`, `data/grammar4.js`) : le cas du « de » (το σπίτι του φίλου). Explication (ο → του, η → της, το → του, et les terminaisons), **56 noms** avec leur génitif, leur règle et une phrase, puis trois activités : **Learn**, **Choose** (choisir la bonne forme, ou le bon article dans une phrase) et **Write** (écrire la forme avec le clavier grec).
- **Grammar → Which case?** : quatre cartes (nominatif, accusatif, génitif, vocatif) avec un exemple, puis un jeu : une phrase avec **un mot en couleur**, et tu touches son cas. Les phrases viennent des cas déjà dans l'appli (accusatif), des 56 génitifs, de 16 phrases au nominatif et de 8 phrases pour appeler quelqu'un (vocatif).
- **Grammar → Drawings** : 6 dessins de plus : les verbes **avoir** (έχω), **vouloir** (θέλω), **aller** (πηγαίνω), **faire** (κάνω) et **manger** (τρώω) à toutes les personnes (comme le dessin d'« être »), et **Prepositions** (σε, από, με, για, χωρίς, προς, μέχρι en petites images).
- Les noms de verbes des dessins sont dans `data/grammar4.js` (`conj`) : pour ajouter un verbe, ajoute-le dans cette liste (il apparaît tout seul dans les dessins, avec les phrases à entendre).
- Le grec (formes du génitif, phrases) est écrit par Claude et n'est pas relu par un locuteur natif.


## Ergonomie sur téléphone

- **Rangées de boutons** : une rangée de 6 boutons ou plus (7 pour les cartes de jeux) devient **une seule ligne** que l'on fait glisser avec le doigt, avec un léger fondu sur le bord qui montre qu'il y en a d'autres ; le bouton choisi est ramené au milieu (`fitRows` dans `js/homeui.js`). Sur grand écran rien ne change.
- **Dessins** : on peut **zoomer** (deux doigts, boutons + et −, double tap, ou molette avec Ctrl), **déplacer** le dessin quand il est zoomé, **changer de dessin** avec les flèches ‹ › ou en glissant le doigt de côté, et revenir au dessin entier avec ⤢. Les numéros sont un peu plus gros et gardent leur taille quand on zoome (`enableDiagramZoom` dans `js/bodydiagram.js`).
- **Barre du bas** : collée tout en bas de l'écran (sous l'indicateur d'accueil d'un iPhone), pleine largeur, avec les coins arrondis seulement en haut.
- **Écran entier et bords du téléphone** : `index.html` demande tout l'écran (`viewport-fit=cover`) et les marges de sécurité (encoche en haut, coins arrondis, encoche quand le téléphone est couché, barre d'accueil de l'iPhone) sont respectées dans `css/homeux.css`. La **couleur de la barre du navigateur** (`theme-color`) suit le thème clair ou sombre. Les balises `apple-mobile-web-app-*` permettent, sur iPhone, d'ouvrir l'appli en plein écran quand on l'ajoute à l'écran d'accueil.


## Grand écran (ordinateur)

- À partir de **1100 px** de large, la barre du bas devient un **menu vertical à gauche** (Home, Learn, Practice, Dictionary, More), et les pages sont plus larges (900 à 1000 px ; l'accueil jusqu'à 1120 px). Les listes de phrases se mettent sur deux colonnes. Rien ne change sur téléphone (`css/homeux.css`, fin du fichier).
- **Raccourcis clavier** (`js/homeui.js`, fin du fichier) : `1`…`9` choisissent une réponse, `Entrée` vérifie ou passe à la suite, `R` rejoue le son, `/` cherche un mot, `H` revient au menu, `Échap` revient en arrière, `?` affiche la liste. Ils ne marchent pas quand on écrit dans une case, ni dans les jeux de mots (où le clavier sert à taper les lettres grecques).

## Dictée de phrases, chansons, chypriote, usages (liste du 2 novembre)

- **Dictée de phrases entières** : nouveau mode **Dictation** dans **Dialogues** (une réplique de 3 à 12 mots) et dans **Texts** (une ligne d'une fable, d'une recette, d'une chanson…). Les modes « Write it » et « Dictation » des **Phrases** gardent leur fonctionnement. Quand la phrase écrite est presque juste, une **correction mot par mot** s'affiche (`diffGreek` dans `js/quiz.js`) : en vert les mots justes, en orange ceux dont l'accent est faux (avec ce qui a été écrit), en rouge souligné les mots manquants, en rouge barré les mots en trop.
- **Chansons** (`data/songs.js`, un nouveau type de texte « Songs » dans **Texts**) : l'*Hymne à la Liberté* de Solomos (les 4 premières strophes, dont les 2 premières sont l'hymne national de la Grèce et de Chypre), *Φεγγαράκι μου λαμπρό*, le chant de Noël *Καλήν εσπέραν άρχοντες* et l'hymne de Pâques *Χριστός ανέστη*. Les paroles sont libres de droits ou traditionnelles ; elles sont recopiées de Wikisource et de Wikipédia grecs (CC BY-SA 4.0) et converties en orthographe moderne à un accent ; les traductions sont de Claude. Chaque chanson a ses mots à toucher, ses questions, la dictée et un lien vers la page d'origine. Je n'ai pas mis de lien YouTube : aucun n'a pu être vérifié.
- **Chypriote** : deux modes en plus dans la page **Cypriot Greek** : **Phrases** (11 phrases recopiées de Wikipédia, avec le grec standard à côté) et **What does it mean?** (un jeu). « Τι κάμνεις; » est construit avec le verbe κάμνω donné par Wikipédia.
- **Usages et politesse** (`data/customs.js`, `js/customs.js`, page dans **Learn**) : 14 fiches (saluer, σου ou σας, mots magiques, le oui et le non avec la tête, restaurant, café, fêtes des prénoms, Pâques, horaires, églises, être invité, mauvais œil, conduire à gauche à Chypre, bienvenue) avec 44 phrases à entendre. Écrites par Claude à partir de connaissances générales : à faire relire.
- **Fichier de relecture** (`relecture-grec.html`) refait : 1710 lignes en 17 sections, avec toutes les nouveautés (cuisine, recettes, mots en plus, mots des dessins, génitif, verbes, usages, chansons, chypriote).


## Page « À propos »

- La carte « Still in development » explique que l'appli est en cours de construction, que le grec doit être relu par un locuteur natif (avec un bouton vers `relecture-grec.html`, ouvert dans un nouvel onglet), et que tout ce qui est anormal, faux ou manquant peut être signalé par mail (`ABOUT.email` dans `js/about.js`). Il n'y a plus de numéro de version : seule la date de la dernière mise à jour (`ABOUT.date` dans `js/about.js`, à changer à chaque mise à jour) s'affiche, en pied de page et sur cette page.
- Si tu mets l'appli en ligne, garde `relecture-grec.html` à côté de `index.html` pour que le lien marche.
- `relecture-grec.html` existe maintenant en **anglais, français et grec** (boutons EN / FR / ΕΛ en haut). Le bouton de « À propos » l'ouvre dans la langue de l'appli (`?lang=en` ou `?lang=fr`). Pour la refaire : `gen_review2.py` + `tr_review.py` (les traductions des textes de la fiche sont dans ce dernier).

- **Menu latéral masquable** (écran ≥ 900 px) : un bouton rond « hamburger » en haut du menu (ou la touche `M`) fait glisser le menu hors de l'écran avec une transition douce ; la page prend toute la largeur ; le même bouton (en haut à gauche, les trois barres) le remet. Le choix est mémorisé (`localStorage`, clé `rail-off`). Code : `toggleRail()` à la fin de `js/homeui.js`, styles à la fin de `css/homeux.css`.

## Recherche rapide, raccourcis en plus, écran de chargement

- **Recherche rapide** (`js/quicksearch.js`) : `Ctrl+K`, la touche `/` ou la loupe en haut de chaque page ouvre une fenêtre. On tape un mot (grec, lettres latines, anglais, français) ou le nom d'une page ; ↑ ↓ choisissent, `Entrée` ouvre la page ou joue le son du mot, `Échap` ferme. Les mots viennent de `DICT`, les pages des tuiles de l'accueil. Sans texte, elle montre les dernières pages ouvertes.
- **Raccourcis en plus** (`js/homeui.js`) : `←` `→` dessin précédent / suivant, `+` `−` zoom du dessin, `S` ajoute le mot à « mes mots » (★), `T` look clair / sombre, `M` cache le menu latéral. La liste complète : touche `?`.
- **Écran de chargement** (`index.html` début de `<body>`, styles `.splash` dans `css/homeux.css`) : le mot Ελληνικά et une barre de progression. Il n'apparaît que si le chargement dure plus d'un quart de seconde, disparaît en fondu dès que l'appli est prête (`js/main.js`), et au plus tard après 8 secondes.

## Animations en plus (`css/anim.css` + `js/anim.js`)

Tout est coupé si l'appareil demande « mouvement réduit ». Pour retirer un effet, supprime son bloc dans `css/anim.css`.

- **Changement de page** : la page qui part s'efface, la nouvelle grandit depuis la tuile touchée (« View Transitions » du navigateur ; sans cette technologie, les blocs de la page arrivent l'un après l'autre). Retour à l'accueil : glissement vers la gauche.
- **Tuiles** : elles se soulèvent au survol. **Réglages** : une pastille de couleur glisse sous le choix. **Puces** : la couleur change en douceur et la puce choisie « pop ».
- **Réponses** (`js/quiz.js` appelle `animAnswer` et `animLeave`) : étincelles et « +1 » sur une bonne réponse, la bonne option brille, la flamme de la série grandit, la question sort vers la gauche avant la suivante.
- **Voix** (`js/audio.js` envoie `gl-sound-start` / `gl-sound-end`) : des ondes autour du bouton 🔊 touché, et le mot grec s'allume.
- **Dessins** (`js/bodydiagram.js` : `data-scene`, `__bdDir`) : les parties apparaissent une à une, la partie touchée rebondit, le dessin suivant glisse du côté de la flèche. Parties vivantes (les numéros sont l'ordre des parties dans `js/scenes.js`) : météo (soleil, nuages, pluie, éclair, vent, étoiles), voiture, avion, rue, paysage, plage, cœur, poumons. Horloges : les aiguilles balaient jusqu'à l'heure.
- **Chouette de l'accueil** (bouton `#buddy`) : elle dort la nuit (mood `sleep` dans `js/mascot.js`), suit la souris des yeux, dit un souhait quand on la touche, fait la fête quand l'objectif du jour est atteint.
- **Ciel de l'accueil** : neige (déc.–fév.), feuilles (oct.–nov.), pétales (mars–mai), feux d'artifice les fêtes nationales (25 mars, 28 oct., 1er avril, 1er oct.), le 1er janvier et le 31 décembre. Le réglage « Festive scenery » les coupe. Pour essayer : `?fx=snow`, `?fx=leaf`, `?fx=petal`, `?fx=fireworks`, `?fx=off` dans l'adresse.
- **Trophée** : une fois par jour, quand l'objectif du jour est atteint (clé `gl-trophy`). **Étoile ★** : elle éclate quand on ajoute un mot. **Clic de souris** : un anneau s'étend.
- **Écran de chargement** : les lettres de Ελληνικά sautent l'une après l'autre, des vagues bougent sous le mot.

## Plus aucun emoji : des dessins SVG à la place

- Tous les emoji (🐟, 🔊, ★, 🔥…) sont remplacés à l'écran par de petits dessins SVG, un par emoji (506 dessins, `data/icons.js`). Les dessins suivent la taille du texte ; ceux qui sont en noir et blanc (haut-parleur, étoile, flèche…) prennent la couleur du texte.
- `js/iconify.js` fait le remplacement : à chaque fois que du texte est ajouté à la page, chaque emoji connu devient un dessin. Dans les endroits qui ne peuvent pas contenir de dessin (placeholder, aria-label, title, `<option>`), l'emoji est simplement retiré. Les icônes des puces de modes viennent de `css/submenu.css` et `css/extras.css` (dessins en « data URI »). Un emoji sans dessin est listé dans `missingEmoji` (console du navigateur).
- Les emoji restent écrits dans les fichiers de données (`data/*.js`) : c'est la clé qui permet de retrouver le bon dessin. Les flèches de texte (→ ← ↔ ↑ ↓) restent du texte, ce ne sont pas des emoji.
- **Changer ou ajouter un dessin** : modifie ou ajoute une ligne dans `tools/icons/ic_*.py` (la clé est le caractère emoji), puis lance `python -X utf8 tools/icons/ic_build.py` ; cela refait `data/icons.js`.

## Fermeture douce des menus

Les menus se ferment maintenant avec la même douceur qu'à l'ouverture (avant, certains disparaissaient d'un coup) : le panneau des réglages (⚙, `toggleSettings` dans `js/theme.js`, classe `.closing`), la recherche rapide (`close()` dans `js/quicksearch.js`) et le menu « More » (0,42 s au lieu de 0,28 s, `css/homeux.css`).
- **Menu latéral (PC)** : la fermeture était différente de l'ouverture parce que la largeur du menu dépendait de `--rail`, qui tombe à 0 quand le menu est caché : le menu rétrécissait d'un coup au lieu de glisser. Sa largeur est maintenant fixe (`--rail-w`), et la fermeture suit la courbe inverse de l'ouverture (`--ease-rev`, `css/homeux.css`, fin du fichier) : c'est exactement l'ouverture à l'envers, en 0,4 s.

## Dictionnaire : 4 000 entrées et plus

- `data/wordbank.js` compte maintenant **1 619 mots** (au lieu de 290), ce qui porte le dictionnaire à **4 036 entrées** (avant : 2 728). Les nouveaux mots couvrent : verbes courants et moins courants, adjectifs, adverbes, conjonctions et prépositions, métiers et école, corps, santé et émotions, famille, villes, pays et nationalités, voyage, argent et lois, maison et outils, vaisselle, vêtements, plats et ingrédients, animaux et nature.
- Chaque mot a son niveau (A1 à C1, mon estimation), son genre (l'article) et son type (nom, verbe, adjectif, adverbe, autre) : `lvl` et `pos` dans `data/wordbank.js` ; le dictionnaire les lit (`js/dictionary.js`).
- Le grec et les traductions ont été écrits par moi, sans relecture par un locuteur natif : ils sont dans `relecture-grec.html` (section « Mots en plus »).
- Les sons de ces mots : `python -X utf8 tools/make_audio.py --workers 2` (répéter jusqu'à « 0 to make »).

## Catégories du dictionnaire (rangement propre)

Chaque mot a maintenant au moins une catégorie de sujet. Il y a 32 catégories, dans cet ordre dans le menu du dictionnaire :
- **sources** : My words, Greek letters (les 24 noms des lettres), Phrases, Dialogues, Conversation ;
- **types de mots** : Verbs, Adjectives, Small words (adverbes, prépositions, conjonctions, pronoms), Numbers, Colors, Grammar, Opposites ;
- **sujets** : Family & animals, Animals, Human body, Feelings & mind, Food & drinks, Cooking, House & clothes, Clothes, Tools & materials, City & travel, Directions, Countries & nationalities, Money & shopping, Society & religion, Weather & nature, Plants & farming, Time & dates, Jobs & hobbies, School & education, Technology & media, Leisure & arts.
- Les verbes, adjectifs et petits mots reçoivent leur catégorie automatiquement d'après leur type (`js/dictionary.js`). Les 453 noms de la première liste (Greek letters) reçoivent leur sujet dans `data/topics.js` (clé = le mot sans article, en minuscules). Les mots de `data/wordbank.js` ont leur catégorie dans le champ `cat`.
- Le jeu de mots (Word games) propose aussi les nouveaux sujets (`WG_TOPICS` dans `js/wordgames.js`), sauf ceux de moins de 25 mots.
- Les niveaux restent A1 à B2 : j'avais d'abord mis C1 à 244 mots, je les ai remis en B2 car l'appli n'a pas de niveau C1.

## Vérifier l'appli automatiquement (outils de contrôle)

- **`python -X utf8 tools/check_app.py`** : contrôle les données (rien n'est modifié). Il cherche : sons manquants, mots sans traduction française, mot sans article, lettres latines dans du grec, niveau ou catégorie qui n'existe pas, doublons dans `data/wordbank.js`, textes anglais du code sans texte français dans `data/fr.js`, fichiers demandés par `index.html` qui n'existent pas, emoji sans dessin. Par défaut il montre 12 cas de chaque sorte ; `--all` les montre tous. Code de sortie 1 s'il trouve un problème.
- **`index.html?check=1`** (à ajouter à l'adresse) : l'appli ouvre toute seule chaque page et chaque mode, en français, puis affiche dans une fenêtre ce qui ne va pas : erreur dans le code, texte sans traduction, emoji sans dessin, mot sans sens français ni catégorie (`js/selftest.js`). Rien n'est enregistré.

## Nouveautés : conjugaison, phrases à construire, lectures

- **Conjugaison** (`data/verbs2.js`, fabriqué par règle) : 126 verbes en plus avec présent, passé (aoriste) et futur (θα + subjonctif). Ils s'ajoutent au thème Verbs de Grammar (13 niveaux « More verbs ») : Learn, Choose, Type et Write it marchent comme pour les 104 verbes d'avant (230 au total). Les verbes se regardent aussi dans le dictionnaire (recherche par forme conjuguée).
- **Phrases à construire** (Word games › Sentences) : on touche les mots dans le bon ordre. 550 phrases de toute l'appli (phrases, dialogues, conversations, textes, recettes, usages, exemples du génitif), filtrées par niveau (A1 à B2).
- **Lectures** (`data/readings.js`, page Texts › Readings) : 13 textes courts (A2 à B2) avec questions, traduction, mots à toucher et dictée. Sources : `readings.txt` et `gen_readings.py` dans le dossier de travail ; on peut aussi modifier directement `data/readings.js`.
- **Voix de secours** : si un son n'est pas encore fabriqué, la voix grecque de l'appareil lit le mot à la place (`FALLBACK_TEXT` dans `js/audio.js`).

## Paysage de l'accueil plus réaliste

- Le paysage de l'accueil est redessiné avec de la profondeur : îles lointaines dans la brume, trois collines l'une derrière l'autre, mer qui s'éclaircit vers l'horizon avec des reflets, village blanc dont chaque maison a une façade éclairée et un côté dans l'ombre, volets bleus, bougainvilliers, escaliers, église à dôme bleu avec clocher, moulin à vent blanc, olivier tordu, cyprès, bateau avec son reflet.
- Thème sombre : nuit au clair de lune, avec des fenêtres allumées. Thème clair : plein jour égéen ; à l'aube et au crépuscule la lumière est rose ou orangée. Les couleurs sont des variables CSS (`css/realscene.css`).
- Le dessin est fabriqué par `tools/gen_scene.py` (il récrit le `<svg class="scene">` de `index.html` et garde les décors de fête). Les touches sur le bateau, le moulin, le mauvais œil et le soleil marchent toujours.
- Sur téléphone, le paysage est agrandi (le village est à droite, le moulin est coupé).
- **Nuages** : des cumulus doux (haut éclairé, bas dans l'ombre, dessinés avec des dégradés, sans flou) et des traînées de cirrus, de tailles et de vitesses différentes. Leur couleur change avec le moment : blanc le jour, rose à l'aube, orangé au crépuscule, bleu pâle au clair de lune (ils restent visibles la nuit, à moitié transparents).
- **Animation jour ↔ nuit** (`css/realscene.css`, fin du fichier) : quand on change de thème (clair ↔ sombre) ou d'heure, tout le paysage change lentement (environ 2 secondes) : les couleurs du ciel, de la mer, des collines, des murs glissent d'une valeur à l'autre (variables CSS enregistrées avec `@property`), le soleil descend dans la mer pendant que la lune monte (et inversement), les étoiles et les nuages apparaissent ou s'effacent, les fenêtres s'allument peu à peu. Sans mouvement si l'appareil demande « mouvement réduit ». Demande un navigateur récent (Chrome, Edge, Safari 16.4+, Firefox 128+) ; sinon le changement est simplement instantané.

## Révision plus intelligente, familles de mots, plus de Chypre

- **Les mots ratés reviennent plus vite** (`js/progress.js`) : un mot raté repasse tout de suite à « à revoir » et passe **en premier** dans la prochaine révision. Quand on le réussit après une erreur, il revient encore **10 minutes plus tard** (`RELEARN`) avant de reprendre sa montée normale dans les boîtes. Un mot raté **3 fois ou plus** (`lapses`) a des délais **deux fois plus courts** tant qu'il n'est pas maîtrisé. Les champs `lapses` (nombre d'erreurs) et `step` (1 = raté, pas encore revu) sont ajoutés aux mots déjà enregistrés sans rien casser.
- **Compteur « à revoir aujourd'hui »** : `Progress.stats().dueToday` compte les mots dus maintenant **ou avant minuit**. La puce de l'accueil (carte Today) dit « N mots à revoir aujourd'hui » ; la page *Review & progress* montre « N de plus plus tard aujourd'hui » et « N mots ratés passent en premier » ; la ligne « Review the words you practiced » de l'accueil donne le même total.
- **Fin de révision** : si tu as raté des mots, un bouton **Réessayer les mots ratés** lance tout de suite une deuxième manche avec eux (une seule fois).
- **Familles de mots** (page `#families`, `data/families.js` + `js/families.js`) : 99 familles, environ 500 mots (δουλεύω → η δουλειά, ο δουλευτής… ; γράφω → το γράμμα, το γραφείο… ; μέρα → η ημερομηνία, η εφημερίδα…). Trois modes : **Learn** (cartes avec un champ de recherche ; touche un mot pour l'entendre), **Which family?** (on voit un mot, on choisit la racine) et **Odd one out** (l'intrus parmi 4 mots). Les mots demandés sont enregistrés par `Progress` (catégorie *Word families*) et reviennent en révision. Le fichier est fabriqué à partir d'une liste texte (`families.txt`, outil `gen_families.py`, qui refuse un mot présent deux fois). Le grec est écrit par Claude de mémoire, pas relu par un locuteur natif : certains liens tiennent au sens plus qu'à l'orthographe.
- **Plus de Chypre** (page `#cypriot`, `data/cypriot.js`) : 15 mots et 8 phrases de plus (τζαι, εν, σήμμερα, εθώρουν, εν να κλαίω…), un mode **How it differs** (7 règles avec exemples à écouter : consonnes doubles, ν final, -ουσιν, sons qui disparaissent, τζαι/εν/ίντα, futur avec εν να, négation), **Places** (32 lieux : villes, Troodos, Pentadaktylos, villages), **Food & drink** (40 plats, douceurs et boissons) et un **Cyprus quiz** (lieu → nom, plat → description). Les formes du dialecte viennent des pages Wikipédia (anglais et grec) ; certaines n'étaient disponibles que dans un résumé de la page : à faire vérifier par un Chypriote. Les noms de lieux et de plats viennent des pages Wikipédia sur la cuisine chypriote et sur les villes. Famagouste, Kyrénia et Morphou sont dans le nord, sous contrôle turc depuis 1974 (dit dans la page).
- **3 recettes chypriotes** de plus dans *Texts → Recipes* : Αφέλια, Μακαρόνια του φούρνου, Λουκουμάδες (`data/recipes.js`).
- Les pages Cypriot et Word families sont dans le menu *Learn*. `relecture-grec.html` a 4 sections de plus (20 à 23). Les nouveaux sons sont à fabriquer avec `python -X utf8 tools/make_audio.py --workers 6` (en attendant, la voix de l'appareil lit le texte).

## Appli installable (PWA) : PC et téléphone, hors ligne

Fichiers : `manifest.webmanifest` (nom, couleurs, icônes), `icons/` (fabriquées par `tools/make_icons.py`, sans bibliothèque), `sw.js` + `audio-list.json` (fabriqués par **`tools/make_pwa.py`**), `js/pwa.js` (boutons de la page *About*), `.nojekyll` et `.gitignore`.

- **Il faut une adresse web sécurisée (https)** : depuis le fichier (`file://`) les navigateurs refusent l'installation et le mode hors ligne. En double-clic, l'appli marche comme avant.
- **Mise à jour automatique** : `sw.js` contient une *version* calculée à partir du contenu de tous les fichiers de l'appli. Si tu changes un fichier et que tu relances `python -X utf8 tools/make_pwa.py`, la version change ; chaque appareil qui a installé l'appli le voit à sa prochaine ouverture avec internet, prend les nouveaux fichiers tout seul et affiche « Une nouvelle version de l'appli est prête » avec un bouton **Recharger**. De plus, les fichiers de l'appli sont toujours redemandés d'abord à internet (la copie gardée ne sert que sans connexion ou si le réseau met plus de 6 s).
- **Sons** : gardés un par un à la première écoute, et tous d'un coup avec le bouton **Download everything for offline use** (page About, environ 102 Mo, à faire en Wi-Fi ; il peut être arrêté et repris).
- **Installer** : PC (Chrome/Edge) : icône dans la barre d'adresse ou bouton *Install the app* de la page About ; Android (Chrome) : même bouton, ou menu ⋮ → « Installer l'application » ; iPhone/iPad (Safari) : Partager → « Sur l'écran d'accueil ».
- **Mettre en ligne (GitHub Pages)** : (1) `python -X utf8 tools/make_pwa.py` ; (2) dans le dossier de l'appli : `git init`, `git add .`, `git commit -m "Elliniká"`, `git branch -M main`, `git remote add origin https://github.com/TON-NOM/ellinika.git`, `git push -u origin main` (le dépôt doit exister, vide, sur GitHub) ; (3) sur GitHub : *Settings → Pages → Deploy from a branch → main / (root)*. L'adresse est `https://TON-NOM.github.io/ellinika/`. Pour mettre à jour : `make_pwa.py`, puis `git add .`, `git commit -m "..."`, `git push`.
- **Pas testé** : le service worker (`sw.js`) n'a pas pu être lancé ici (le navigateur intégré refuse tous les service workers). Le reste (carte d'installation, téléchargement des sons, message de mise à jour) a été essayé. À vérifier sur ton adresse en ligne : l'installation, le mode avion, la mise à jour.
- La progression est gardée dans chaque navigateur/appareil (pas partagée) : utilise *Save my progress* / *Restore a backup* pour la transférer.
- **Bouton « Installer l'appli » dans les paramètres** : sur l'accueil, l'engrenage ouvre les paramètres ; tout en bas, la section **App** a le bouton *Install the app*. Il est toujours là : si le navigateur autorise l'installation, un appui lance la fenêtre d'installation ; sinon il explique où trouver l'installation (iPhone : Partager → « Sur l'écran d'accueil ») ; en double-clic sur le fichier (`file://`) il dit qu'il faut ouvrir l'appli depuis son adresse web. Une fois l'appli installée, il affiche « Appli installée ». Code : `js/pwa.js` (`pwaButton`), bouton `#pwaSet` dans `index.html`.

## Pied de page de l'accueil (plus soigné)

- `css/footer.css` + le bloc `<footer class="home-foot">` de `index.html` : un panneau arrondi avec l'icône de l'appli qui dépasse du bord (anneau doré), le nom **Elliniká / Ελληνικά**, la ligne « projet personnel », quatre boutons ronds (**À propos**, **Raccourcis clavier** sur PC seulement, **Installer l'appli**, **Signaler une erreur** qui ouvre un e-mail), une frise de clés grecques, « Fait avec ♥ pour apprendre le grec » (le cœur bat doucement, sauf si l'animation est réduite) et la date de la dernière mise à jour (`ABOUT.date` de `js/about.js`, sans numéro de version). Il suit les thèmes clair et sombre et les deux langues. Les vagues animées au-dessus restent.

## Famille et Animaux séparés, belle-famille ajoutée

- L'ancienne catégorie **Family & animals** est coupée en deux : la page **Family** (`#family`, arbre généalogique + 2 groupes : *Family* 23 mots et *In-laws & extended family* 33 mots) et la page **Animals** (`#animals`, 30 animaux). Dans le dictionnaire, les catégories sont **Family** et **Animals** (la catégorie *Animals* existait déjà pour les animaux du dictionnaire).
- **Nouveau groupe « In-laws & extended family »** (`data/family.js`) : πεθερός, πεθερά, τα πεθερικά, γαμπρός, νύφη, κουνιάδος, κουνιάδα, νυφάδα, συμπέθερος, συμπεθέρα, πατριός, μητριά, προγονός, προγονή, ανιψιός, ανιψιά, οι γονείς, τα αδέρφια, τα εγγόνια, προπάππους, προγιαγιά, σύζυγος (ο/η), σύντροφος (ο/η), νονός, νονά, βαφτιστήρι, κουμπάρος, κουμπάρα, συγγενής (ο/η), συγγένεια. Pas d'image pour ces mots (le mode *Image* n'utilise que les mots qui en ont). Leurs sons sont à fabriquer comme les autres.
- `data/family.js` garde **un seul** objet `FAMILY` (groupes `family`, `inlaws`, `animals`) : `js/vocab.js` en tire `FAMILY_PAGE` et `ANIMALS_PAGE`. Les clés de progression restent `v:fam:...` (option `keyPrefix`), donc rien n'est perdu ; les mots déjà travaillés qui avaient la catégorie « Family & animals » sont reclassés tout seuls (`Progress.recat`).
- Le tri a aussi corrigé des erreurs : 50 animaux et 17 mots de famille du fichier `wordbank.js` sont rangés dans *Animals* et *Family* ; 24 mots de transport et de ville (η σήραγγα, το φρένο…) qui étaient rangés dans « Family & animals » vont dans *City & travel*, ζαχαροπλαστική dans *Food & drinks*, et « εγώ » dans *Grammar*. Les doublons κουνιάδος, κουνιάδα et ανιψιά ont été retirés de `wordbank.js` (ils sont maintenant dans la page Family).
- `relecture-grec.html` a une section 24 pour la belle-famille.

## Design et ergonomie : réglages, menu à ranger, recherche, bandeaux, cartes mémoire

- **Page Réglages** (`#settings`, `js/settings.js`, `css/settings.css`) : l'engrenage (accueil et barre du haut) ouvre maintenant une vraie page au lieu d'une petite fenêtre ; elle est aussi dans le menu *Plus* (« Réglages »). On y trouve la langue, l'apparence, les couleurs, la taille du texte, la lecture facile, les lettres latines, la vitesse de la voix, le paysage de fête, le menu d'accueil, et l'installation / le mode hors ligne (la carte « App » qui était dans *About*).
- **Apparence Auto** (clair / sombre / **Auto** = suit le téléphone ou l'ordinateur, `gl-theme`) et **couleurs** : « Par page » (une couleur par catégorie, comme avant) ou une couleur unique partout (bleu Égée, olive, terre cuite, violet, rose ; `data-accent` sur `<html>`, `gl-accent`). Le raccourci clavier **T** passe du clair au sombre.
- **Lettres latines** (`gl-lat`) : *Always* / *On tap* (floutées jusqu'au toucher du mot) / *Never*. Elles sont dans des `<span class="lt">` (ou `.dlat`, `.lat`) ; après une réponse de quiz elles restent visibles ; la page *Greek letters* les montre toujours. Pour ajouter un texte latin à ce réglage : l'écrire dans `<span class="lt">…</span>`.
- **Menu d'accueil à ranger** : dans Réglages, chaque catégorie a une étoile (**épingler** : elle passe dans une ligne *Pinned* sous *Today*) et un œil (**cacher**). Les choix sont dans `gl-menu`. « Tout réafficher » remet tout. Les catégories cachées restent trouvables par la recherche.
- **Recherche rapide** (Ctrl+K) : historique des recherches (6, avec « Effacer »), filtres *Tout / Mots / Pages*, niveau A1–B2 et catégorie, badge de niveau et bouton d'écoute sur chaque mot (8 résultats).
- **Bandeau** en haut de chaque page d'apprentissage (`renderPageHero` dans `js/router.js`, `css/pages.css`) : le dessin de sa tuile, son nom et sa phrase, aux couleurs de la catégorie, avec une frise grecque.
- **Pages vides plus soignées** (`emptyState()` dans `js/helpers.js`) : *My words*, *My difficulties*, recherche sans résultat (dictionnaire et familles de mots) montrent un grand dessin, une phrase, des étapes et des boutons.
- **Cartes mémoire** (mode *Flashcards* dans toutes les listes de mots, `js/flashcards.js`) : on touche la carte pour la retourner (prononciation, sens, genre), puis « Je le savais » (→, touche 2 ou glisser vers la droite) ou « Encore » (←, touche 1 ou glisser vers la gauche). Un mot raté revient 3 cartes plus loin ; la manche finit quand tout est su. Chaque réponse va à *Progress* (objectif du jour, révisions).

## Réglages : bouton, menu repliable ; météo : « Weather talk »

- **Bouton des réglages** : trois curseurs dessinés (au lieu de l'engrenage). Un appui ouvre la page *Settings*, un second appui revient à la page d'avant ; le bouton reste en couleur tant que les réglages sont ouverts. (`#setBtn` dans `index.html`, `js/theme.js`.)
- **« Home menu » repliable** : la liste des catégories s'ouvre et se ferme avec son titre (fermée à chaque ouverture des réglages) ; le titre dit « N épinglé(s) · N caché(s) ». (`js/settings.js`)
- **Nouveau groupe « Weather talk »** (catégorie *Weather & nature*, 25 mots dans `data/nature.js`) : τι καιρό κάνει;, κάνει ζέστη / κρύο, βρέχει, χιονίζει, φυσάει, έχει λιακάδα / συννεφιά / ομίχλη / καταιγίδα, les adjectifs ζεστός, κρύος, δροσερός, καυτός, παγωμένος, ηλιόλουστος, συννεφιασμένος, βροχερός, υγρός, ξηρός, ο καύσωνας, η πανσέληνος, η σελήνη, ζεσταίνομαι, κρυώνω. Les phrases « il fait… » sont classées comme *phrase* dans le dictionnaire. `relecture-grec.html` a une section 25 pour les faire vérifier.

## Avant la mise en ligne : sources, vie privée, bienvenue, nouveautés, accessibilité

- **Sources et licence** et **Vie privée** : deux cartes de plus dans la page *About* (textes dans `index.html`). Elles disent d'où viennent les contenus (Wikipédia CC BY-SA 4.0, Wikisource, Wikiquote, police Commissioner), que la voix est synthétique, que « sauf mention contraire, l'appli, ses textes et ses dessins sont de Thibaud Derville » (aucune licence ouverte n'est choisie : à décider plus tard), et que rien n'est envoyé ailleurs (pas de compte, pas de suivi ; seule la police vient de Google Fonts).
- **Droits de la voix** : vérifié, voir la réponse donnée dans la conversation. Le point à retenir : rien n'autorise ni n'interdit clairement la diffusion des sons faits avec `edge-tts` ; Microsoft autorise les voix Azure pour des usages éducatifs, avec l'obligation de dire que la voix est synthétique (c'est écrit dans *Sources et licence*).
- **Date** : `ABOUT.date` = 02/11/26 (la version reste 1.0.0).
- **Langue automatique** : au premier lancement, la première langue du téléphone ou du navigateur décide (français si elle commence par « fr », sinon anglais) ; le choix des réglages est ensuite retenu (`gl-lang`).
- **Écran de bienvenue** (`js/welcome.js`) : une fois, pour un nouvel appareil sans progression : langue, objectif du jour, par où commencer (lettres, test de niveau, ou menu), et l'installation quand elle est possible. Il peut être rouvert depuis *Réglages → Show the welcome screen*. Pas affiché avec `?check=1`.
- **Nouveautés** (`#news`, `data/news.js`, `js/news.js`) : l'historique de l'appli, le plus récent en haut. À chaque mise en ligne : ajouter une entrée en haut de `data/news.js` et changer `ABOUT.date` ; les appareils qui avaient vu l'ancienne date reçoivent un message « Elliniká a été mise à jour » avec un bouton vers cette page. Liens : *About*, *Réglages*.
- **Accessibilité** : contrôle automatique des contrastes (clair et sombre, toutes les pages) : le texte sur la couleur d'une catégorie passe en noir quand la couleur est claire (variable `--oncat`, calculée dans `js/theme.js`), le gris du thème clair est plus foncé, les badges A1 à B2 aussi, quelques textes colorés utilisent `--accent`. Aucun bouton sans nom, aucun champ sans étiquette, aucune image sans `alt`, aucun débordement horizontal à 320 px de large. Cibles tactiles : boutons « chip » à 36 px au moins. Anneau de focus clavier visible partout. Non vérifié : lecteur d'écran réel, texte agrandi à 200 %, contrastes dans les dessins (SVG).

## Accueil : « Welcome to Elliniká » et paysage plus réaliste

- Le petit titre de l'accueil dit maintenant **Welcome to Elliniká** (« Bienvenue dans Elliniká »).
- **Paysage** (`tools/gen_scene.py` récrit le `<svg class="scene">` de `index.html` ; couleurs dans `css/realscene.css`, fin du fichier) :
  - un **vrai ciel** en dégradé (nuit bleu profond jusqu'à l'horizon plus clair ; jour bleu clair ; aube rose et or ; crépuscule orange et violet) qui monte jusqu'en haut de la page ;
  - la nuit : **voie lactée**, environ 240 étoiles de couleurs et de brillances différentes (certaines au-dessus du paysage), **étoiles filantes** de temps en temps, petites **lumières sur les îles lointaines**, **halos chauds** autour des fenêtres allumées du village ;
  - **grain de pellicule** très léger et **vignettage** (bords un peu plus sombres) sur toute l'image, pour un rendu moins « dessin plat ».
- Tout reste animé comme avant (vagues, bateau, moulin, nuages, jour/nuit). Les animations des étoiles filantes et des lumières s'arrêtent si le mouvement est réduit. Non mesuré : la fluidité sur un vieux téléphone (les filtres du grain et de la voie lactée sont dessinés une seule fois, mais à surveiller).

## Plus de grammaire, statistiques et badges

- **Trois nouveaux thèmes de grammaire** (`js/grammar5.js`, données `data/grammar5.js` fabriquées par `gen_grammar5.py`) :
  - **Perfect** : έχω + la forme courte qui ne change pas (θα γράψει → έχω γράψει), 46 verbes, 6 personnes ; Learn (avec une explication qui compare έγραψα, έγραφα et έχω γράψει), Choose, Write. La forme courte est prise dans la 3ᵉ personne du futur du verbe (`future[2]` sans « θα »).
  - **Irregular verbs** : 40 verbes dont le passé ne ressemble pas au présent (πάω → πήγα → θα πάω), Learn, Choose (dans les deux sens : passé → verbe, verbe → passé), Write.
  - **Articles** : tableaux (ο/η/το, τον/την/το, του/της…, au singulier et au pluriel, et ένας/μία/ένα) puis jeu « Which article? » avec un nom, un cas et un nombre.
  Ils sont ajoutés à `TOPICS` et `G_TOPICS` (comme `js/grammar3.js`). Les sons sont à fabriquer comme les autres (`make_audio.py` lit `GRAMMAR5`). Le grec est écrit par Claude, pas relu par un locuteur natif : section 26 de `relecture-grec.html`.
- **Page Statistiques et badges** (`#stats`, `js/stats.js`, tuile « Statistics & badges » dans *Practice now*, lien depuis *Review & progress*) : 9 chiffres (aujourd'hui, 7 jours, total, série, meilleure série, jours étudiés, mots travaillés, maîtrisés, % de bonnes réponses), un graphique des 7 derniers jours avec la ligne de l'objectif, un calendrier de 12 semaines (carrés plus ou moins foncés), la réussite par catégorie (et « À travailler »), et **22 badges** (bronze, argent, or) : premiers pas, réponses (100, 500, 2 000), séries de 3, 7 et 30 jours, mots maîtrisés (10, 50, 200), objectif atteint, journée record, quiz sans faute (1 et 10), oiseau de nuit, lève-tôt, explorateur, globe-trotter, test de niveau fait, ami de Chypre, arbre généalogique, fan de grammaire.
  - Tout est calculé à partir de ce que `Progress` garde déjà (`Progress.dayCounts()`, `Progress.bestStreak()`), plus quelques notes dans `gl-meta` (nuit, tôt, quiz parfaits, pages visitées) et la date de chaque badge dans `gl-badges`.
  - Un nouveau badge est annoncé par un petit message (une fois). La première vérification donne en silence les badges déjà mérités. Pour ajouter un badge : une ligne dans la liste `BADGES` de `js/stats.js` (emoji qui a un dessin, niveau 1 à 3, nom et phrase en anglais et en français, et une fonction qui donne `[valeur, cible]`).
- Au passage : une rangée de boutons cachée (`hidden`) disparaît vraiment, même sur téléphone (les longues rangées sont des boîtes flex qui ignoraient l'attribut ; visible sur la page Grammaire, rangée des niveaux de verbes).

## Dessins plus réalistes et plus pratiques (tous les schémas)

Moteur : `js/bodydiagram.js` (fonction `bodySvg`), style : `css/diagrams.css`.
- **Lumière et profondeur sur tous les dessins** (environ 50) : une lumière douce en haut à gauche, des bords un peu plus sombres (vignettage), un très léger grain, un fond de « studio » plus doux dans le cadre. Les dessins qui sont des tableaux de mots (grammaire, nombres, alphabet) restent plats pour ne pas gêner la lecture (`FLAT_DRAWING`). Les miniatures n'ont pas ces effets.
- **Volume** : les dessins marqués `volume:true` (corps de face et de dos, visage, main, pied, squelette) reçoivent un dégradé sur chaque forme (clair au milieu, plus sombre sur les côtés), ce qui leur donne du relief. Les figures debout (`ground:true`) ont une ombre au sol.
- **Corps humain redessiné** (face et dos) : membres qui s'affinent et se renflent comme des muscles (`limb`, `limbs`), torse, épaules, mains et pieds plus naturels, lignes anatomiques fines (clavicules, sternum, nombril, rotules). Les mêmes numéros et les mêmes mots qu'avant.
- **Plus pratique** :
  - zones de toucher plus grandes autour des numéros (cercle invisible 1,75 fois plus grand) ;
  - bouton **Aa** : affiche le mot grec à côté de chaque numéro (réglage gardé dans `gl-bdlabels`) ;
  - bouton **cible** : mode **« Test me »** : le mot est dit et écrit, on touche la bonne partie du dessin (10 questions, 2 essais) ; chaque réponse va à `Progress` (catégorie *Drawings*) et un dessin sans faute compte pour le badge « Perfect score » ;
  - anneau de focus clavier sur les parties.
- Pas fait (à décider) : redessiner à la main les autres schémas pour un rendu plus photographique ; les icônes (les emoji dessinés) restent plates.

### Suite : tous les schémas en relief, mains et visage naturels, icônes avec profondeur
- **Tous les dessins « riches »** (vêtements, maison, cuisine, rue, voiture, avion, nature, plage, météo, métiers, marché, taverne, temps, couleurs…) : chaque forme pleine reçoit maintenant sa propre lumière (en haut à gauche) et son ombre (en bas à droite) par un dégradé partagé `#scGshade` (`SC.p`, `SC.e`, `SC.r` dans `js/scenes.js`). Pas de dégradé sur les traits, les détails (`w:0`), les vitres (`rgba`) et les formes minuscules ; `{sh:false}` le retire pour une forme. `SC.scope` ne renomme pas ce dégradé commun.
- **Métiers** : une ombre sous chaque personne.
- **Main** : doigts qui s'affinent (`limb`), paume et poignet plus naturels. **Visage** : un contour avec la mâchoire.
- **Icônes colorées** (les emoji dessinés) : une petite ombre dessous et un liseré clair dessus (`css/icons.css`) ; les icônes d'une seule couleur ne changent pas.
- **Garde-fou pour les écrans lents** (`perfGuard` dans `js/bodydiagram.js`, règles `.bd-lite` dans `css/diagrams.css`) : à l'ouverture d'un dessin, la vitesse de l'écran est surveillée pendant environ une seconde. Si elle est trop basse (moins de 20 images par seconde environ), le dessin passe en version légère : plus de grain, plus de relief sur chaque forme, plus d'animation ; le choix est gardé pour la visite (`sessionStorage` « gl-lite »). Il ne fait rien quand la page n'est pas au premier plan. Testé en simulant un écran rapide (reste complet) et un écran lent (passe en léger). Pas mesuré sur un vrai téléphone.
- Taille des dessins animés (éléments dans le dessin, dont le relief ajouté) : voiture 200 (13 formes avec relief, 15 parties animées), avion 133 (17, 8), météo 267 (35, 11), rue 277 (49, 4), plage 214 (28, 6), paysage 300 (54, 5).

## Reprise de quiz, squelette du dictionnaire, statistiques animées, chouette vivante
- **Reprendre un quiz** (`js/quiz.js`) : l'état d'un quiz non fini est gardé dans `gl-quizstate` (nom du jeu, nombre de réponses, score, heure ; 30 jeux au plus). En rouvrant le même jeu dans la journée, on voit « Continuer ton quiz ? » avec *Continue* (le compte et le score sont gardés, les questions sont nouvelles) ou *Start over*. La fin du quiz efface l'état. Pas gardés : les révisions (`review…`), le défi (`challenge…`) et le test de niveau (`level…`), voir `quizNoResume`.
- **Squelette du dictionnaire** (`js/dictionary.js`) : `renderDictionary()` montre tout de suite 7 lignes grises qui brillent, puis dessine la liste 70 ms plus tard (`renderDictionaryNow()`). « Show more » n'efface pas la liste.
- **Statistiques animées** (`animateStats` dans `js/stats.js`) : les 9 chiffres comptent de 0 à leur valeur, les barres des 7 jours poussent, le calendrier s'allume carré par carré, les barres de catégories et les badges apparaissent en cascade. Rien ne bouge avec « réduire les animations ».
- **Chouette** (`js/owl.js`, bulle `.owlsay`) : elle fait un signe et dit bonjour une fois après l'écran de bienvenue ; elle applaudit (bulle + petit message avec une chouette) quand on gagne un badge ou qu'on atteint l'objectif du jour ; elle s'endort après une minute sans rien faire (une touche la réveille). Elle n'est visible que sur l'accueil ; ailleurs, le message du bas porte une petite chouette.


- **Accueil, mode jour** : la phrase « Learn Greek faster… » n'a plus de boîte sombre derrière elle ; un voile très léger et clair, des lettres or foncé avec un halo blanc (`:root[data-theme="light"] .hero-hook` dans `css/home.css`). Le mode nuit ne change pas.

## Mini-leçons, phrases d'exemple, signaler une erreur
- **Mini-leçons** (page Grammaire, sujet « Mini lessons », `data/grammar6.js` + `js/grammar6.js`) : 8 courtes leçons écrites (futur θα, να + verbe, petits pronoms, comparer, accorder les nombres, trois familles de verbes, demandes polies, « il y a »). Chaque leçon s'ouvre et se ferme (la première est ouverte), a des phrases à toucher pour les entendre, parfois un tableau de formes, et des exercices (40 phrases d'exemple, 34 trous). Les jeux Choisir / Écrire piochent dans tous les exercices. Les données sont écrites en anglais et en français (`{en, fr}`).
- **Phrase d'exemple par mot** (`data/examples.js` + `js/examples.js`) : 258 phrases courtes pour des mots courants. Elles s'affichent sous la réponse d'un quiz (si le mot de la question en a une) et dans le dictionnaire (bouton « Example »). Pour en ajouter : écrire une ligne `mot|phrase grecque|anglais|français` dans `examples.txt` (dossier temporaire de travail) puis lancer `gen_examples.py` ; plusieurs mots peuvent partager une phrase avec `mot1/mot2`. Les fichiers `tools/make_audio.py` et `tools/check_app.py` connaissent déjà `examples.js` : lancer `make_audio.py` fait les sons des nouvelles phrases.
- **Signaler une erreur** (`reportLink` dans `js/quiz.js`) : sous chaque réponse de quiz, un lien ouvre un e-mail à l'adresse de `ABOUT.mail` (`js/about.js`, `openMail`) avec la page, le jeu, la question, la réponse affichée et la version déjà écrits. Aucun serveur : c'est un simple lien `mailto:`.

## Code de transfert, licences
- **Code de transfert** (`js/backup.js`, boutons dans la carte de sauvegarde de la page Révision et progrès) : « Make a transfer code » fabrique un texte (`GLT1.<contrôle>.<données>`) qui contient la même sauvegarde que le fichier, compressée (deflate) puis en base64 ; on le copie (ou « Share » sur téléphone), on l'envoie à soi-même, et sur l'autre appareil « Enter a transfer code » le colle et restaure après confirmation. Le contrôle (empreinte FNV) refuse un code coupé ou abîmé ; les retours à la ligne ajoutés par une messagerie sont ignorés. Si le navigateur ne sait pas compresser, le code est `GLT0` (plus long, non compressé). Pas de QR : une progression de 52 mots fait déjà 5 Ko de code, et un QR ne contient que 3 Ko au maximum. Pas de serveur, pas de compte.
- **Licences** : `LICENSE` (MIT, pour le code), `LICENCES.md` (qui explique le partage : code MIT, textes/données/dessins CC BY-SA 4.0, sons tous droits réservés), `audio/LICENSE.txt` (sons). La carte « Sources and licence » de la page À propos le dit aussi. Les sons restent « tous droits réservés » tant que les règles de la voix (edge-tts) ne sont pas claires.

## Accueil plus vivant, animation d'ouverture, taille des icônes
- **Écran d'ouverture** (simplifié le 05/11/26) : `#splash` dans `index.html` n'a plus qu'un message : « Welcome to / Bienvenue sur » et le grand nom « Elliniká » (police Didot, le « á » en or). Il apparaît en grand (`spShow`), reste un instant, puis rétrécit en s'effaçant (`spShrink`) quand la page est prête. Style : section 1 de `css/homenew.css`. Durée minimale 1,5 s depuis le début de la page (`window.__introMs`, fixé dans le script du début de `index.html`, lu par `INTRO_MS` dans `js/main.js` ; 0,6 s si le téléphone demande moins de mouvement ; 0 dans l'autocontrôle `?check=1`). Un toucher ou une touche le passe. Réglages → « Opening animation » : Off le supprime (clé `gl-intro`). L'écran de bienvenue des nouveaux visiteurs (`js/welcome.js`) attend sa fin. Les lettres qui montent, les vagues, la barre de chargement et le pourcentage ont été supprimés (ainsi que leur CSS).
- **Accueil** (`css/homenew.css`, `js/homefx.js`) : le menu (rail à gauche sur PC, barre du bas sur téléphone) est la seule navigation et suit la page : sur l'accueil, le bouton allumé est la section lue (`homeSection()` dans `js/homefx.js`, utilisée par `navOf` de `js/homeui.js` ; Today = Home, Practice now = Practice, Learn / Vocabulary / Tools = Learn). Il n'y a plus de barre de sections au milieu de la page. Haut de page sobre (titre blanc, trait doré, bouton en verre dépoli). Titres de sections plus marqués, tuiles qui apparaissent en douceur quand on défile (`.fx` puis `.in`, coupé si `prefers-reduced-motion`), cartes « Practice now » colorées, titre animé, « Learn » en 3 colonnes sur grand écran (première et dernière tuile doubles).
- **Accueil en tableau de bord (PC, fenêtre ≥ 1100 px)** : section 7 de `css/homenew.css`. « Today » (`.dash-today`) et « Pinned / Recently » (`.dash-side`, liste verticale, absente si vide) sont côte à côte dans `.dash-top` ; « Practice now » reste sur une rangée de 5 cartes ; Learn / Vocabulary / Tools deviennent 3 onglets (`#dashTabs`, bouton `data-dtab`, pastille qui glisse ; code dans `js/homefx.js`, `homeTab(nom)` ; onglet gardé dans `gl-tab`) avec une grille de 5 colonnes (3 pour Tools). Les titres Learn/Vocabulary/Tools restent dans la page mais sont cachés sur PC. Le bouton Learn du menu va à la barre d'onglets et choisit l'onglet Learn (`goSection` dans `js/homeui.js`). Sous 1100 px (téléphone, petite fenêtre) rien ne change : la barre d'onglets est cachée et les trois groupes restent l'un sous l'autre. La feuille « More » liste toujours tout.
- **Accueil « maison de luxe »** (section 8 de `css/homenew.css`) : le premier écran occupe toute la hauteur (`100svh`) : paysage plein écran, nom, phrase, barre de recherche, bouton « Find your level » et flèche pour défiler (`#heroScroll`, code dans `js/homefx.js`). La recherche et le bouton sont dans `.hero` (ids inchangés). Le texte du premier écran apparaît en douceur quand l'écran d'ouverture est parti (`index.html` ajoute la classe `sp-gone` sur `<html>`). Le texte reste blanc aussi en thème clair. Au-dessus de 761 px, les titres de section sont en petites majuscules espacées et les tuiles sont calmes (fond sombre, trait fin, plus de halo coloré) ; sur téléphone les tuiles gardent leurs couleurs. Les onglets PC deviennent du texte avec un trait doré qui glisse. Le pied de page est celui d'avant (pastille ronde, vagues, boutons, grecque, version). Le bouton des réglages est en `position:fixed` tout à droite (44 px, comme le bouton du menu à gauche) ; pour que `fixed` marche, `.home` ne doit jamais garder de `transform` (animation `homeFade`, seulement un fondu). Le contenu du premier écran est centré au milieu de l'écran sur ordinateur. Le paysage (`.deco`) n'a plus de masque sur l'accueil (trop lourd à redessiner) : un dégradé le fond dans la page, et la teinte de l'heure le recouvre (`.deco::before{z-index:1}`).
- **Cuisine : dessin « Cutlery & table »** (fin de `js/scenes.js`, `SC_CUTLERY` + `renderCookingDiagram`, branché dans `js/vocab.js`, conteneur `#cookingDiagram` dans `index.html`) : une table dressée vue de dessus avec 10 pièces numérotées (nappe, serviette, assiette, fourchette, couteau, cuillère, petite cuillère, verre, soucoupe, tasse). Tous les mots existaient déjà (aucun nouveau son) ; `COOKING` a été ajouté à `BODY_WORDS` dans `js/bodydiagram.js`. Attention : dans un dessin, les couleurs d'un `<pattern>` doivent être en `style="fill:…"` (le CSS des dessins écrase l'attribut `fill`).
- **Téléphone plus ergonomique** (fin de `css/homenew.css`) : sur le premier écran (< 900 px) le nom flotte en haut, la recherche et « Find your level » sont en bas (zone du pouce, `margin-top:auto`), la flèche de défilement est cachée. Les onglets Learn / Vocabulary / Tools existent maintenant partout : sur téléphone et tablette (< 1100 px) c'est une grande barre à trois boutons de 48 px avec une pastille dorée qui glisse (au lieu de trois listes l'une sous l'autre) ; au-dessus de 1100 px ce sont les onglets soulignés. Sur PC, le bloc du premier écran est remonté de 15 px (`padding-bottom` 70 px).
- **Paysage plus grand sur téléphone** (< 700 px, fin de `css/homenew.css`) : le dessin `.scene` fait 1040 px de large, décalé à droite (village, église, lune), posé au-dessus de la barre du bas ; le haut du bloc de recherche est remonté en conséquence. Un rectangle `topfade` dans le SVG du paysage (`index.html`) efface la couture visible en thème clair, là où commencent la vignette et le grain (y = -110).
- **Premier écran « luxe »** (section 9 de `css/homenew.css`) : police grecque à empattements GFS Didot (chargée par Google Fonts dans l'en-tête de `index.html`, repli Georgia hors ligne) pour le nom et la phrase ; la frise grecque (méandre) remplace le trait doré ; la recherche n'est qu'un trait (ligne du bas) ; le bouton « Find your level » est rectangulaire, au liseré doré, en capitales espacées (son texte est écrit par `js/router.js`, sans emoji) ; une ligne de faits `.hero-meta` (A1 → B2 · 4 000+ mots · Grèce et Chypre : chiffres écrits à la main, à remettre à jour si le dictionnaire change beaucoup). Tout est plus grand sur téléphone (titre `19.5vw`). Date de version : `ABOUT.date` dans `js/about.js` = 05/11/26.
- **Même style partout** (section 10 de `css/homenew.css`) : titres `h1` et bandeaux de pages (`.pagehero`) en GFS Didot avec la frise dorée ; carte Today refaite (`js/today.js` : anneau d'objectif `.tg-ring` en SVG avec `pathLength=100`, mot du jour en Didot, boutons rectangulaires) ; écran d'ouverture réduit à un message (voir « Écran d'ouverture ») ; tuiles calmes aussi sur téléphone (≤ 760 px, les couleurs restent sur les icônes). **Recherche** (`js/homeui.js`) : `gl-searches` garde les 6 dernières recherches (`hsRemember`), la liste vide montre ces recherches ou 5 mots à essayer (`HS_TRY`), chaque résultat montre sa catégorie (`.hs-cat`) ; dans le premier écran la liste est en `position:absolute` (par-dessus la page, vers le haut sur téléphone).
- **Adresse e-mail cachée** (avant la mise en ligne) : l'adresse n'est plus écrite en clair nulle part. `ABOUT.mail` (`js/about.js`) la garde en base64 ; `aboutEmail()` la reconstitue et `openMail(sujet, texte)` ouvre le programme de mail seulement au toucher d'un bouton (pied de page, page À propos, « Report a mistake » des quiz). Le bouton de la page À propos s'appelle maintenant « Write an e-mail » (« Écrire un e-mail »). **Pour changer l'adresse** : taper `btoa("toi@exemple.fr")` dans la console du navigateur et coller le résultat dans `ABOUT.mail` ; **pour supprimer le contact** : `mail: ""` (la carte et les liens disparaissent). `relecture-grec.html` a la même adresse cachée (script en bas de page) : si on la régénère avec `gen_review2.py`, il faudra refaire ce petit changement. Le `README.md` (anglais + français) est la page d'accueil du dépôt GitHub.
- **Se connecter avec Google pour sauvegarder la progression** (`js/gsync.js`, panneau « Save with Google » dans la page Révision et progression, partie « Backup »). **Il reste caché tant que `GSYNC.clientId` est vide**, donc rien ne change pour les visiteurs avant la configuration. Principe : un seul petit fichier (`ellinika-progress.json`) est gardé dans le dossier caché « données d'application » du Google Drive de l'utilisateur (permission `drive.appdata` seulement : l'appli ne voit aucun autre fichier). Pas de serveur : le navigateur parle directement à Google (Google Identity Services, mode « token ») ; le script de Google n'est chargé qu'au toucher de « Sign in with Google ». Le jeton vit en mémoire (environ une heure) ; ensuite il faut retoucher « Sync now ». Les clés envoyées : progression, jours, badges, favoris, maîtrisés, test de niveau, conversations, meilleurs scores (`GS_KEYS`) ; jamais le thème, la langue ni les réglages. Les deux copies sont **fusionnées** (`gsMerge`) : pour un mot, la copie pratiquée en dernier, avec les plus grands compteurs ; nombres = max ; listes = union ; dernier test de niveau. Limite connue : un favori retiré sur un appareil peut revenir après une synchro. Une sauvegarde silencieuse se fait toutes les minutes si le jeton est encore valable et que la copie Google n'a pas été changée par un autre appareil. Testé seulement avec un faux Google (aucune vraie connexion). **Configuration (à faire une seule fois, après avoir mis l'appli en ligne)** :
  1. Aller sur <https://console.cloud.google.com/>, créer un projet (par exemple « Ellinika »).
  2. *API et services → Bibliothèque* : activer **Google Drive API**.
  3. *API et services → Écran de consentement OAuth* : type **Externe**, nom de l'appli « Elliniká », ton e-mail ; dans « Niveaux d'accès », ajouter `.../auth/drive.appdata` ; puis **Publier l'appli** (état « En production », sinon seuls 100 testeurs peuvent se connecter). Cette permission n'est pas « sensible » : pas de vérification Google à passer.
  4. *Identifiants → Créer des identifiants → ID client OAuth* : type **Application Web** ; « Origines JavaScript autorisées » = `https://ellinikaapp.netlify.app` (l'adresse de l'appli en ligne, sans `/` à la fin). Copier l'**ID client** (`....apps.googleusercontent.com` ; ce n'est pas un secret).
  5. Coller l'ID dans `GSYNC.clientId` (`js/gsync.js`), relancer `python -X utf8 tools/make_pwa.py`, pousser sur GitHub. Pour tester en local, ajouter aussi `http://localhost:8000` aux origines autorisées. **Bouton « Sign in »** (`js/account.js`) : il est déjà visible partout (en haut à droite de l'accueil, dans la barre du haut des autres pages, à côté du bouton des réglages). Tant que `GSYNC.clientId` est vide, il explique que la connexion n'est pas encore active. Une fois l'ID collé, un toucher ouvre la fenêtre Google ; ensuite le bouton affiche la photo (ou l'initiale) et le prénom, et un toucher ouvre un petit menu (nom, e-mail, dernière synchro, « Sync now », « Sign out »). Rester déconnecté reste possible : l'appli marche pareil. Les permissions demandées sont `openid profile email` (nom et photo) et `drive.appdata` (dossier caché).
- **Taille des icônes (ordinateur)** : la variable CSS `--icos` (0,7 à 1,7) multiplie la taille de toutes les icônes de l'accueil à partir de 761 px de large. Boutons − / + dans le menu de côté (PC, juste au-dessus de « More »), curseur dans les Réglages, clé `gl-icos` (lue dès le début de `index.html`, pour éviter un saut à l'affichage). Sur téléphone, les icônes gardent leur taille fixe.
