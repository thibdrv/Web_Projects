# Retrieve Job

Une application qui cherche les offres d'emploi qui te correspondent sur plusieurs sites et les range dans un seul fichier Excel, triable et filtrable. Elle est gratuite : pas de compte, pas de clé, pas d'abonnement.

Sites lus :

| Site | Ce qu'il apporte |
|---|---|
| Ergodotisi.com | Offres à Chypre |
| CyprusJobs.com | Offres à Chypre |
| CyprusWork.com | Offres à Chypre |
| FxCareer.eu | Offres forex et fintech, surtout à Limassol |
| Kariera.com.cy | Offres à Chypre (les 5 plus récentes par recherche) |
| CareerFinders.com.cy | Cabinet de recrutement : toutes les offres des catégories choisies (Data Analysis, FinTech, Forex, Online Gaming, IT, Shipping, Customer Services…) |
| EmeraldZebra.cy | Cabinet de recrutement fintech, tech, finance et iGaming : toutes ses offres |
| RemoteOK, Jobicy, Remotive | Offres en télétravail ouvertes à l'Europe ou au monde entier |

Les réglages par défaut visent un profil junior à Chypre (data, développement web, postes en français / vente / support), mais tout se change dans la fenêtre.

## Installation

1. **Installe Python 3.10 ou plus récent** depuis [python.org](https://www.python.org/downloads/). Sous Windows, coche « Add python.exe to PATH » pendant l'installation.
   - Sous Linux (Ubuntu, Debian…), installe aussi la fenêtre et les environnements Python : `sudo apt install python3-tk python3-venv`.
2. **Télécharge le projet** : sur GitHub, bouton vert **Code** → **Download ZIP**, puis décompresse-le où tu veux. Ou, si tu as Git : `git clone` suivi de l'adresse du dépôt.
3. **Lance `app.py`** (voir ci-dessous). Rien d'autre à installer : au premier lancement, l'application installe elle-même ce qu'il lui faut, dans le dossier `.venv` du projet.

Pour mettre à jour, télécharge la nouvelle version et remplace les fichiers. Tes résultats (`results`), tes réglages (`settings.json`) et la liste des offres déjà vues (`.cache`) ne font pas partie du projet téléchargé : garde-les en copiant ces dossiers et ce fichier dans la nouvelle version.

## Utilisation

1. Double-clique sur `app.py` (Windows), ou, dans un terminal ouvert dans ce dossier : `python app.py` (`python3 app.py` sur Mac et Linux).
2. La première fois, l'application installe ce qu'il lui faut (environ une minute). Le bouton passe à « Lancer la recherche » quand c'est prêt.
3. Règle tes paramètres dans les onglets (voir plus bas), puis clique sur **Lancer la recherche**.
4. L'avancement s'affiche en bas de la fenêtre. À la fin, `results/jobs.xlsx` s'ouvre dans ton tableur (Excel, LibreOffice, Numbers…).

Les sites sont interrogés en même temps (chacun avec ses pauses), et chaque nouvelle offre est ouverte pour lire l'expérience et les langues demandées. Une recherche prend quelques minutes ; la toute première est plus longue, car toutes les offres sont nouvelles.

## Le fichier de résultats : `results/jobs.xlsx`

Une seule feuille avec toutes les offres gardées. Les plus récentes sont en haut. **Les offres trouvées par la dernière recherche sont surlignées en jaune** ; à la recherche suivante, elles perdent ce surlignage et ce sont les nouvelles qui sont en jaune. Les colonnes :

| Colonne | Contenu |
|---|---|
| Trouvée le | Date du lancement qui l'a trouvée |
| Catégorie | Le type de poste (data, dev, french / sales / support…). Pour CareerFinders et EmeraldZebra, si le titre ne correspond à aucun type, c'est leur propre catégorie (« Forex », « FinTech », « iGaming »…) |
| Titre, Entreprise, Ville | L'offre |
| Publiée | Date de publication, quand le site la donne |
| Expérience | Ce que l'offre demande : « 2+ ans », « junior » (d'après le titre) ou « non précisé » |
| Site, Lien | D'où vient l'offre, avec un lien cliquable |
| Statut | Pour toi : « Postulé », « Pas intéressé »… L'application ne touche jamais à cette colonne |

Chaque colonne a un filtre (la flèche dans l'en-tête) pour trier ou n'afficher qu'une catégorie. Tu peux trier le fichier et l'enregistrer : l'application garde ton ordre et ajoute les nouvelles offres en haut.

- **Ferme `jobs.xlsx` dans Excel avant de lancer une recherche** : Excel bloque le fichier ouvert. Si c'est le cas, l'application le dit tout de suite.
- **Ne supprime pas de lignes pour te débarrasser d'une offre** : mets plutôt « Pas intéressé » dans Statut et filtre. (Une ligne supprimée ne revient pas, mais tu perds sa trace.)
- **Les offres trouvées il y a plus d'un mois sont retirées automatiquement** à chaque recherche (réglable dans la fenêtre). Celles dont tu as rempli la colonne Statut restent.
- Une offre n'est jamais ajoutée deux fois, même si tu la supprimes ou qu'elle a été retirée. Si tu utilises aussi Job Application Agent, placé dans un dossier `job_agent` à côté de celui-ci, les offres déjà dans son suivi sont ignorées aussi (sans lui, ce réglage ne fait rien).
- Pour repartir de zéro, supprime le dossier `results` et le dossier `.cache`.

## Les paramètres

Tout se règle dans la fenêtre et s'enregistre dans `settings.json` (au clic sur « Enregistrer les paramètres » ou au lancement d'une recherche). « Paramètres par défaut » remet les réglages d'origine.

**Onglet « Types de poste »** : un type = une catégorie dans les résultats.
- *Recherches* : ce qui est tapé dans la recherche de chaque site.
- *Mots du titre* : une offre va dans ce type si son titre contient un de ces mots (« analyst » trouve aussi « Analysts »). Une offre qui ne correspond à aucun type est écartée, car les sites renvoient beaucoup d'offres sans rapport avec la recherche.
- Si un titre correspond à plusieurs types, le premier de la liste gagne.
- « + Ajouter un type de poste » et « Supprimer » pour en créer ou en retirer.

**Onglet « Expérience, villes et filtres »** :
- *Expérience maximum* (3 par défaut) : chaque nouvelle offre est lue ; si elle demande plus d'années (« 5+ years of experience », « τουλάχιστον 4 χρόνια »…), elle est écartée. Les titres junior, graduate, trainee, intern sont toujours gardés. Une offre qui ne précise rien est gardée, avec « non précisé ».
- *Exclure les titres de niveau* : senior, lead, director, head of…
- *Écarter les offres qui exigent* (grec par défaut) : une offre est écartée si son titre ou sa description est en grec, ou si elle demande le grec (« Fluent in Greek and English », « Excellent command of Greek »…). Elle est gardée quand le grec est seulement un plus (« Greek is an advantage ») ou qu'il s'agit d'autre chose (« the Greek market », « Greek language classes » offerts). Tu peux ajouter d'autres langues, en anglais : russian, arabic…
- *Villes* : Nicosie, Larnaca, Pyla, Dali, Limassol, avec leurs autres orthographes. Une offre qui indique seulement « Cyprus » est gardée. Les sites proposés ne publient que des offres à Chypre, donc il n'y a pas de réglage de pays.
- *Offres publiées depuis moins de* (31 jours par défaut). Ergodotisi ne donne pas la date : ses offres sont toujours gardées.
- *Retirer du fichier les offres trouvées il y a plus de* (31 jours par défaut, 0 = jamais). Les offres avec un Statut restent.
- *Autres mots exclus du titre* : par défaut, les langues autres que le français, l'anglais et le grec (« Russian speaking sales »…). Enlève une langue si tu la parles.
- *Télétravail : zones acceptées* et *Pages lues par site et par recherche*.

**Onglet « Sites »** : coche ou décoche chaque site (par exemple les sites de télétravail si tu ne veux que du sur place). En dessous, choisis les catégories lues sur CareerFinders. Ces sites spécialisés (CareerFinders, EmeraldZebra) sont lus en entier plutôt que par recherche ; leurs offres passent ensuite par les mêmes filtres (villes, niveau, expérience, grec, date). Comme ils publient beaucoup de postes seniors, une bonne partie est écartée.

## Le lancer tout seul chaque jour

Ouvre `app.py` une fois avant, pour que l'installation soit faite. La recherche se fait avec les derniers paramètres enregistrés dans la fenêtre.

- **Windows**, Planificateur de tâches : **Créer une tâche de base** → chaque jour → **Démarrer un programme** → programme `.venv\Scripts\python.exe` du dossier de l'application (son chemin complet, par exemple `C:\Users\toi\Retrieve_job\.venv\Scripts\python.exe`), argument `retrieve_jobs.py`, et ce même dossier dans « Commencer dans ».
- **Mac et Linux**, avec `crontab -e`, une ligne comme : `0 9 * * * cd /chemin/vers/Retrieve_job && .venv/bin/python retrieve_jobs.py` (tous les jours à 9 h).

## Bon à savoir

- L'application attend une à deux secondes entre deux pages pour ne pas surcharger les sites.
- Si un site ne répond pas, il est sauté et le message l'indique ; les autres continuent. Une offre dont la page n'a pas pu être lue est gardée avec « page non lue » dans Expérience.
- La lecture de l'expérience et des langues se base sur le texte de l'offre : elle peut se tromper sur une formulation inhabituelle. Jette un œil à la colonne Expérience.
- Si un site change sa présentation, il peut ne plus rien renvoyer (« 0 offres » pour toutes les recherches). Il faudra alors adapter son code dans le dossier `sources`.
- L'API gratuite de Remotive ne donne plus qu'une dizaine d'offres récentes, donc elle trouve rarement quelque chose.
- LinkedIn, Indeed et Glassdoor ne sont pas inclus.

## Version en ligne (gratuite)

La même recherche existe en site web : `webapp.py` (serveur Flask) et le dossier `web`. Le serveur **ne garde rien** : les réglages, les offres, les statuts et la liste des offres déjà vues restent dans le navigateur du visiteur, partent avec chaque recherche et reviennent avec les nouvelles offres. Le fichier Excel est fabriqué à la demande par le bouton « Télécharger le fichier Excel ». « Importer un ancien jobs.xlsx » permet de retrouver ses offres sur un autre appareil.

**Essayer chez soi** : `pip install -r requirements-web.txt` puis `python webapp.py`, et ouvrir <http://127.0.0.1:8000>.

**Mettre en ligne sur Render (gratuit)** :
1. Mets le projet sur GitHub.
2. Sur [render.com](https://render.com) : **New +** → **Blueprint** → choisis le dépôt. Le fichier `render.yaml` fait le reste (formule gratuite, image `Dockerfile`).
3. Une fois déployé, Render donne une adresse en `onrender.com`.

La page est en **français et en anglais** (boutons FR / EN en haut ; au premier passage, la langue du navigateur est utilisée). Le journal de recherche et le fichier Excel téléchargé suivent la langue choisie, et un fichier Excel en anglais peut être réimporté. Les textes sont dans `web/i18n.js` (page) et `messages.py` (serveur) : pour ajouter une langue, il suffit d'y ajouter un bloc, un test vérifie que toutes les clés existent partout.

**Rubrique Contact.** Si la variable d'environnement `CONTACT_EMAIL` est renseignée (sur Render : service → **Environment** → **Add Environment Variable**), la page affiche un lien « Contact » et un bouton « Écrire un e-mail » qui ouvre l'application e-mail avec le sujet et les dernières lignes du journal déjà écrits (le visiteur peut les relire avant d'envoyer). L'adresse n'est pas écrite dans le code ni dans le HTML : elle est envoyée par le serveur à la page. Sans la variable, la rubrique n'apparaît pas.

Ce qu'il faut savoir sur la formule gratuite :
- Le site s'endort après 15 minutes sans visite : la première visite suivante met environ une minute à se réveiller. Une recherche en cours le garde éveillé.
- Une recherche tourne sur le serveur pendant 5 à 15 minutes : la page doit rester ouverte.
- Pour que le service ne soit pas détourné, il y a au plus 2 recherches en même temps pour tout le monde (`MAX_RUNNING`), une recherche par visiteur toutes les 5 minutes (`COOLDOWN_SECONDS`), et chaque recherche est limitée à 12 recherches de mots-clés, 5 pages par site et 20 minutes. Les réglages envoyés par un visiteur sont vérifiés et bornés ; le texte des offres n'est jamais affiché comme du HTML.
- Les sites lus voient l'adresse du serveur, pas la tienne. Certains peuvent refuser un hébergeur : le message « erreur, ignoré » apparaît alors dans le journal et les autres sites continuent. À vérifier après le premier déploiement.

N'importe quel autre hébergeur de conteneurs (Fly.io, Railway, un VPS avec Docker) convient : `docker build -t retrieve-job .` puis `docker run -p 8000:8000 retrieve-job`. Garde un seul processus : les recherches en cours sont gardées en mémoire.

## Tests

```
python -m unittest discover -s tests -t .
```

(Les tests de la version web demandent `pip install -r requirements-web.txt`; sans Flask ils sont sautés.)

## Utilisation responsable

Cet outil est fait pour un usage personnel : chercher ses propres offres, quelques fois par jour au plus. Il lit des pages publiques en laissant des pauses entre elles. Respecte les conditions d'utilisation des sites lus, et ne t'en sers pas pour copier leurs offres en masse ou les republier.

## Licence

MIT : voir le fichier [LICENSE](LICENSE).
