# AUDIT_NOTES — Le Carnet Gourmand

**Date :** 26/10/2026
**Périmètre :** `BDD/`, `entities/`, `daos/`, `services/`, `controllers/`, `exceptions/`, `utils/`, `public/`, `api.php`, `index.html`, `API_CONTRACT.md`, `CLAUDE.md`, `BDD/Schema_BDD.png`, `repartition_couches.png`.

**Méthode :** tout le code a été lu, et des scripts ont contrôlé le dump SQL (correspondance avec les images, doublons, données de démo). PHP et MySQL ne sont pas installés sur ce poste, donc **le code n'a pas été exécuté**. Les erreurs « fatales » ci-dessous sont déduites des règles de PHP 8.x (compatibilité des signatures, invariance des types de propriété, types de retour) et de MySQL/MariaDB. Il faudra les confirmer avec `php -l` et un appel de chaque route une fois l'environnement installé.

**Gravité :**
- **P0 (bloquant)** : la fonctionnalité plante ou ne peut pas marcher.
- **P1 (majeur)** : résultat faux, données corrompues ou faille de sécurité.
- **P2 (mineur)** : incohérence, dette technique, non-conformité sans impact immédiat.

---

## 0. Synthèse

État de chaque parcours tel que le frontend l'appelle aujourd'hui :

| Parcours (front) | Route appelée | État | Cause principale |
|---|---|---|---|
| Navbar / état de session | `GET Session` | Partiel | `startTime` toujours `null` (§4.1) |
| Lister / filtrer les recettes | `GET Recette`, `GET Categorie` | Fonctionne | ~150 requêtes SQL par liste ; emails des auteurs exposés (§5) |
| Détail d'une recette | `GET Recette&pk=` | Partiel | Vidéo YouTube refusée dans l'`iframe` (§6.2) |
| Créer un compte | `POST Compte` | Fonctionne | Dates enregistrées fausses (§4.1) |
| Se connecter | `POST Login` | Partiel | Comptes de démo sans mot de passe ; mots de passe contenant `& < > " '` refusés (§4.4) |
| Se déconnecter | `GET Logout` | **P0** | `TypeError` → 500, alors que la session est bien détruite (§3.6) |
| Partager une recette | `POST Recette` | **P0** | Erreur de syntaxe PHP, puis colonne `image` obligatoire (§3.1, §3.7) |
| Favoris (état, ajout, retrait) | `GET/POST/DELETE Favori` | **P0** | Méthode inexistante + table `favoris` inexistante (§3.4, §3.5) |
| Noter / voir la moyenne | `GET/POST Note` | **P0** | `NoteDao` et `NoteService` ne compilent pas (§3.2, §3.3) |
| Lire les commentaires | `GET Commentaire` | **P0** | 403 dès qu'un commentaire d'un autre utilisateur existe (§3.10) |
| Poster un commentaire | `POST Commentaire` | Fonctionne | Date fausse ; commentaire visible sans modération et vecteur XSS (§5) |
| Modération, profil, gestion des catégories | — | Absent | Aucune interface, et aucun compte admin ne peut se connecter (§2.3) |

En pratique, avec le dump fourni : un visiteur peut parcourir et lire les recettes, créer un compte et se connecter. **Partager une recette, les favoris et les notes ne fonctionnent pas.** Les commentaires plantent dès que deux personnes ont commenté la même recette. La déconnexion affiche une erreur.

---

## 1. Fichiers manquants ou incomplets

| Élément | Attendu par | Constat |
|---|---|---|
| `index.php` | `CLAUDE.md` (« point d'entrée principal de l'application web »), `repartition_couches.png` | Absent : c'est `index.html` qui joue ce rôle. Il faut soit créer `index.php`, soit corriger `CLAUDE.md`. |
| Configuration BDD (`config.php`, `.env`…) | `utils/BddSingleton.php:14-18` | `DB_HOST`, `DB_NAME`, `DB_USER` et `DB_PASS` sont vides, et aucun fichier de configuration n'existe. L'API ne peut se connecter à aucune base. |
| `API_CONTRACT.md` complet | `CLAUDE.md` §2 | Le fichier est tronqué (9 lignes) : seul le format de succès est décrit et le bloc de code n'est pas fermé. Il manque le format d'erreur et la liste des routes. |
| `FavoriService::estFavori()` | `controllers/FavoriGetController.php:38` | La méthode est appelée mais n'est définie nulle part → `Error` fatale. |
| Upload d'image de recette | `recettes.image NOT NULL` (SQL l.222) | Le formulaire n'a aucun champ fichier, et ni le contrôleur ni le service ne traitent d'image. |
| Exceptions métier / gestion centralisée | `CLAUDE.md` (`/exceptions`) | Une seule classe existe (`HttpStatusException`). Rien ne gère `InvalidArgumentException`, `PDOException`, `TypeError` ou `Error` (§3.9). |
| Données de démo exploitables | — | Aucun compte n'a de mot de passe (§2.3). Les tables `favori`, `mettre_note` et `ecrire_commentaire` sont vides. |
| Routes non exposées | services existants | Aucun contrôleur n'appelle `CompteService::restore()` ni `NoteService::MoyenneParRecette()`. |
| Écrans frontend | routes backend existantes | Aucune vue pour : profil (`Compte GET/PUT/DELETE`), liste des favoris, modération (`Recette PUT est_approuve`, `Commentaire PUT`), gestion des catégories (`Categorie POST/DELETE`), suppression d'un commentaire, d'une recette ou d'une note. `mettreAJourNote()` (`recetteDetail.js:299`) n'est jamais appelée. |
| Menu mobile | `index.html:21` (`#navToggle`) | Aucun écouteur JS. Sous 820 px, la navbar est en `display:none` (`style.css:74-81`) et ne s'ouvre jamais : **la navigation est impossible sur mobile.** |

---

## 2. Base de données : schéma SQL vs MCD vs entités

### 2.1 Clés et contraintes manquantes (P1)

- **Tables d'association sans clé primaire.** `categories_recettes`, `favori`, `mettre_note` et `ecrire_commentaire` n'ont ni clé primaire ni contrainte d'unicité (SQL l.346-376). Pourtant le MCD (associations 0,n–0,n) et les DAO supposent une clé composite `(fk_compte, fk_recette)` ou `(fk_recette, fk_categorie)`. Conséquences :
  - les doublons sont possibles : même favori, même note, même lien recette/catégorie (`RecettePutController` ajoute une catégorie à chaque appel) ;
  - les erreurs de doublon attendues par le code ne se déclenchent jamais : `FavoriDao::insert` (code 1062) et `NoteDao::insert` (SQLSTATE 23000, « déjà noté ») ;
  - un `UPDATE` ou un `DELETE` sur `(fk_compte, fk_recette)` touche tous les doublons.
- **`ecrire_commentaire` sans identifiant propre.** Un utilisateur ne peut avoir qu'un commentaire « adressable » par recette. Un 2ᵉ commentaire est bien inséré, mais l'approbation et la suppression agissent sur les deux. `CommentairePostController` renvoie `pk_commentaire: 1`, une valeur fixe sans signification. Il faut ajouter `pk_commentaire` en AUTO_INCREMENT.
- **`comptes.email` et `comptes.pseudo` sans `UNIQUE`**, alors que le MCD les met en gras comme identifiants. `CompteDao::insert` (l.131-132) attend une erreur 1062 « Email ou pseudo déjà utilisé » qui n'arrive jamais. Plusieurs comptes peuvent donc partager un email, et `isValidCredential` (`LIMIT 1`) en choisit un arbitrairement.
- **FK de `categories_recettes` sans `ON DELETE/UPDATE CASCADE`**, contrairement aux trois autres tables d'association (l.426-428).

### 2.2 Types et nommage

| Colonne SQL | MCD | Entité PHP | Problème |
|---|---|---|---|
| `roles.nom` | `nom` | `Role::$role`, lu via `$row->role` (`entities/Role.php:28`) | La colonne n'existe pas : le warning est masqué et **le nom du rôle vaut toujours `null`** (P1). |
| `mettre_note.note DECIMAL(2,1) NULL` | `BYTE` | `float`, validé de 0 à 5 par pas de 0,5 | Trois types différents. Le commentaire « ENUM » de `NoteDao.php:79` est faux. `NULL` est autorisé alors qu'une note vide n'a pas de sens, et `floatval(null)` donne 0. |
| `recettes.image NOT NULL` | — | `?string` (nullable) | Le front n'envoie jamais d'image, donc l'`INSERT` est refusé (erreur 1048) (P0). |
| `recettes.lien NULL` | — | `?string` | Données incohérentes : la recette 1 a `''`, les autres `NULL`. |
| `comptes.mot_de_passe`, `date_creation`, `est_banni`, `est_supprime` | snake_case | `motDePasse`, `dateCreation`, `estBanni`, `estSupprime` | Seule entité en camelCase : le JSON n'a pas les mêmes conventions d'une entité à l'autre (P2). |
| — | — | `Recette::$categories` | Jamais remplie : toujours `[]` dans le JSON, le front ne peut pas afficher les catégories d'une recette. |
| — | — | `Commentaire::$compte` / `$recette` | Propriétés typées non nullables (`Compte`), mais setters en `?Compte`. `setCompte(null)` (`CommentaireService.php:47,56,76,84`) lèverait une `TypeError` (P2, chemin aujourd'hui masqué par §3.10). |

### 2.3 Jeu de données

- **Aucun compte ne peut se connecter.** Les comptes 1 (admin) et 2 ont `mot_de_passe = ''` (l.166-167), et `isValidCredential` exige un hash non vide. Il n'y a donc aucun admin : les recettes 26 à 30 (non approuvées) ne pourront jamais être validées (P0 pour une démo).
- Doublon : les recettes 53 et 60 sont toutes deux « Bœuf Bourguignon Traditionnel », avec la même image.
- La recette 2 « Bavarois aux fraises » a des `details` vides et un texte de remplacement dans `ingredients`.
- Les 79 recettes appartiennent au compte 1. Si ce compte est banni ou supprimé, tout le catalogue renvoie 403 (§4.2).
- Les recettes 1 et 20 contiennent des émojis sur 4 octets (👑, 😍…), incompatibles avec la connexion en `utf8` (§4.6).
- Images : les 79 chemins correspondent à des fichiers de `public/image/` (aucun manquant, aucun orphelin). Beaucoup de noms contiennent `,`, `&`, `'`, `(` ou `œ`, ce qui est fragile dans des URL (P2).
- Le dump ne contient ni `CREATE DATABASE` ni `USE` : il faut créer la base à la main et reporter son nom dans la configuration.

---

## 3. Bugs PHP bloquants (P0)

| # | Fichier:ligne | Bug | Effet |
|---|---|---|---|
| 3.1 | `controllers/RecettePostController.php:53-58` | La ligne `foreach ($fieldsToCheck as $field) { $value = … }` a disparu. `$value` est indéfini, et l'accolade en trop ferme la classe : `protected function checkRights()` se retrouve hors de la classe → **ParseError**. | `POST Recette` renvoie toujours 500 : impossible de partager une recette. |
| 3.2 | `daos/NoteDao.php:160` et `:182` | `update(IEntity $entity)` n'a pas `: IEntity`, et `delete(...)` n'a pas `: void`, alors que `AbstractDao` les déclare. | Erreur fatale dès le chargement de la classe : **toutes les routes Note** plantent. |
| 3.3 | `services/NoteService.php:16` et `:117` | `protected NoteDao $dao;` redéclare `AbstractService::$dao` (de type `IDao`), or les types de propriété sont invariants. `update()` n'a pas de type de retour. | Erreur fatale, même une fois 3.2 corrigé. |
| 3.4 | `daos/FavoriDao.php:24, 47, 65, 85, 103, 131, 150` | Table `favoris` au lieu de `favori`. | Chaque requête Favori lève une `PDOException` 1146. Elle n'est pas capturée dans `exists()` et `findByCompte()` → 500 sans JSON. |
| 3.5 | `controllers/FavoriGetController.php:38` | `estFavori()` n'existe pas dans `FavoriService`. | `Error` fatale : le bouton favori reste désactivé même quand on est connecté. |
| 3.6 | `controllers/LogoutGetController.php:40-44` | `processResponse()` renvoie un tableau alors que `execute(): string` attend une chaîne → `TypeError`. | 500. La session est pourtant détruite, donc l'interface affiche « Impossible de se déconnecter » sans se rafraîchir. |
| 3.7 | `daos/RecetteDao.php:176` + `RecettePostController` | L'image n'est jamais fournie : `NULL` est envoyé dans une colonne `NOT NULL`. | `INSERT` refusé (erreur 1048), même après correction de 3.1. |
| 3.8 | `utils/BddSingleton.php:14-18` | Identifiants de connexion vides. | Pas de connexion : `die()` renvoie du texte brut, pas du JSON. |
| 3.9 | `api.php:31-42` | Seule `HttpStatusException` est capturée. | Les `InvalidArgumentException` (setters de `Compte`, contrôles des DAO), les `PDOException` non enveloppées, les `TypeError` et les `Error` donnent une page 500 vide. Côté front, `response.json()` lève alors une `SyntaxError` qui masque la vraie erreur. |
| 3.10 | `services/CommentaireService.php:80-85` → `services/CompteService.php:55-57` | Pour chaque commentaire, `findByRecette()` appelle `CompteService::findByPk()` sur l'auteur. Pour un non-admin, cette méthode exécute `_403_Forbidden()` (donc `exit`) dès que l'auteur n'est pas l'utilisateur connecté. Le `try/catch` ne capture que les exceptions et ne peut rien faire contre un `exit`. | **Dès qu'une recette a un commentaire d'un autre utilisateur, `GET Commentaire` renvoie 403** « Vous n'avez pas le droit de voir le compte d'un autre utilisateur » à tous les visiteurs non-admin. |
| 3.11 | `utils/functions.php:11` | À vérifier : `E_STRICT` est déprécié en PHP 8.4 (version indiquée dans l'en-tête du dump). La constante est lue alors que `api.php:2-4` vient d'activer `display_errors=1` et `E_ALL`. | Si le serveur tourne en PHP ≥ 8.4, un message « Deprecated » est écrit avant le JSON **dans toutes les réponses**, ce qui les rend illisibles par `response.json()`. |

---

## 4. Bugs PHP fonctionnels, par couche

### 4.1 `utils/` et `api.php`

- **P1** `functions.php:7` : `MYSQL_DATE_FORMAT = "Y-m-d h:m:s"`. `h` est l'heure sur 12 h et `m` est le **mois** au lieu des minutes. Toutes les dates écrites (comptes, recettes, commentaires) sont fausses. Format correct : `"Y-m-d H:i:s"`.
- **P1** `functions.php:116-137` (`raiseHttpStatus()`) : il n'y a pas de `case 409`. Les conflits (`FavoriService.php:66`, `CompteDao.php:132`) sortent donc en **500 « Unhandled status code: 409 »**. Le `case 405` ignore le message.
- **P1** `functions.php:67-113` : les helpers `_4xx` / `_5xx` n'envoient ni `Content-Type: application/json` ni `"success": false`.
- **P1** Les services appellent `_403_Forbidden()`, qui fait `echo` puis `exit` (par exemple `CategorieService.php:30`, `CompteService.php:56`). La couche métier écrit donc elle-même la réponse HTTP, contrairement au schéma `repartition_couches.png` (« Si non autorisé = exception (httpstatus) »). C'est la cause directe de §3.10. Même problème avec `_401_Unauthorized()` dans les contrôleurs.
- **P1** `api.php:13-15` démarre la session **avant** `SessionManager::manageSession()`. `session_set_cookie_params()` (`SessionManager.php:33-40`) n'est donc jamais appliqué, et le cookie n'a ni `HttpOnly` ni `SameSite`. De plus, `domain => 'localhost'` codé en dur casserait l'accès via `127.0.0.1` ou en production.
- **P1** Deux systèmes de session coexistent : `functions.php` (`START_TIME = "startTime"`, `isLogged()`, `getComptePkFromSession()`) et `SessionManager` (`START_TIME = "start_time"`). `SessionGetController.php:27` lit `$_SESSION["startTime"]`, qui n'est jamais écrit : `startTime` vaut toujours `null` et `endTime` toujours « maintenant + 45 min ».
- **P2** `functions.php:225, 253, 265, 278` : `throw _400_Bad_Request($msg = "")("...")` appelle `_400_Bad_Request("")`, qui sort avec un message vide ; le reste de l'expression n'est jamais évalué. `getWord()` déclare `: int` mais renvoie une chaîne → `TypeError`. Ces fonctions sont aujourd'hui inutilisées.
- **P2** `SessionManager::getRolePkFromSession()` lit `fk_role` sans `isset`.
- **P2** `api.php:16-17` et `AbstractController.php:42` écrivent toute la session et chaque réponse dans `error_log` à chaque requête (volume de logs et données personnelles).

### 4.2 DAO

- **P1** `CompteDao::findByPk()` (l.98-103) lève 403 si le compte est banni ou supprimé. Or cette méthode sert aussi à charger les auteurs dans `RecetteDao`, `CommentaireDao`, `FavoriDao` et `NoteDao` : **un seul auteur banni fait échouer toute la liste** (recettes, commentaires, favoris). Le `try/catch` d'anonymisation de `CommentaireService` (l.51-57, 80-85) intervient trop tard, puisque l'exception part du DAO.
- **P1** `RecetteDao::findByPk()` filtre `est_supprime = 0`. Une recette supprimée qui est en favori, notée ou commentée fait donc échouer `FavoriDao::findByCompte()` et `NoteDao::findByCompte()` en 404.
- **P1** Requêtes N+1 : chaque ligne recharge son compte et son rôle avec des requêtes séparées. Lister 74 recettes coûte environ 1 + 74 × 2 = **149 requêtes**. Chaque commentaire recharge en plus la recette complète et son auteur. `NoteDao::createEntityFromRow` (l.36, 41) instancie même un nouveau DAO par ligne.
- **P1** `CompteDao::update()` (l.150) re-hashe systématiquement `getMotDePasse()` (voir la corruption de mot de passe en §4.3).
- **P2** `CompteDao::insert()` (l.124) : le rôle par défaut `3` n'existe pas (seuls 1 et 2 existent). Le bug est masqué parce que le service force le rôle 1.
- **P2** `CompteDao::insert/update` mélangent `PASSWORD_BCRYPT` et `PASSWORD_DEFAULT`.
- **P2** `CommentaireDao::update()` (l.154) : `rowCount() === 0` quand la valeur ne change pas, car MySQL compte les lignes réellement modifiées. Réapprouver un commentaire déjà approuvé renvoie donc un faux 404.
- **P2** `RecetteDao::insert()` (l.180-197) insère la recette puis ses catégories sans transaction. De même, `RecettePostController` insère la recette puis la catégorie via un second service : si la 2ᵉ étape échoue, la recette reste sans catégorie.
- **P2** `RecetteDao::findByPkAdmin()` ne charge pas `compte` (propriété non initialisée).
- **P2** `NoteDao::findByCompte()` lève 404 au lieu de renvoyer `[]`. `NoteDao::insert()` traduit toute erreur 23000 (y compris une violation de FK) en « déjà noté ». `NoteDao::findAll()` lève une `Exception` générique.
- **P2** `CategorieDao::delete()` (l.100-103) traduit l'erreur de FK 1451 en **405** (il faudrait 409) et renvoie le message SQL brut au client.
- **P2** `CommentaireDao::recetteExists()` interroge la table `recettes` depuis le DAO des commentaires, et n'est jamais utilisée.

### 4.3 Services

- **P1 – corruption de données** `CompteService::update()`, branche admin (l.90-101) : `$oldEntity` vient de `CompteDao::findByPk()`, qui ne charge pas le mot de passe (`""`). `CompteDao::update()` enregistre ensuite `password_hash("")`. **Bannir un utilisateur écrase son mot de passe.**
- **P1** Un admin **ne peut pas débannir** un compte : `findByPk()` lève 403 sur un compte banni avant toute mise à jour. Même blocage dans `CompteService::delete()` sur un compte déjà banni.
- **P1** `CompteService::update()`, branche utilisateur (l.85-87) : si la requête ne contient pas `mot_de_passe`, `setMotDePasse("")` lève une `InvalidArgumentException` → 500. Si elle en contient un, la politique `isPassword()` n'est pas appliquée (`ComptePutController` ne vérifie que `isSanitizedString`).
- **P1** `CommentaireService::findByRecette()` (l.64-91) ne filtre pas `est_approuve` : **les commentaires non modérés sont publics**, alors que le front annonce « en attente de modération ».
- **P1** `NoteService::dejaNote()` (l.143-149) ne peut jamais renvoyer `false`, puisque le DAO lève 404 quand la note n'existe pas.
- **P2** `RecetteService::findByPk()` renvoie aussi les recettes non approuvées à n'importe quel visiteur.
- **P2** `RecetteService::update()` ne gère pas les catégories, et `RecettePutController` (l.109-116) **ajoute** une catégorie au lieu de la remplacer.
- **P2** `CommentaireService::insert()` ne vérifie ni que la recette est approuvée, ni l'unicité (voir §2.1).
- **P2** Code mort, car les DAO lèvent toujours une exception : `if (!$recette)` (`NoteService.php:91`), `if (!$commentaire)` (`CommentaireService.php:38`), `if ($compte === null)` (`CompteGetController.php:63`), `if ($role === null)` (`RoleGetController.php:37`).
- **P2** `isUser()` et `isAdmin()` (`functions.php:51-58`) relancent chacun une lecture complète du compte et du rôle : `isUser() || isAdmin()` coûte 4 requêtes.

### 4.4 Contrôleurs

- **P1** `NoteGetController.php:37` : la « moyenne » renvoyée est `totalNoteParRecette()`, c'est-à-dire **le nombre de notes**, et non `MoyenneParRecette()`.
- **P1** `LoginPostController.php:40-43` refuse tout mot de passe contenant `& < > " '` (via `isSanitizedString`). Or l'inscription (`isPassword`) exige un caractère spécial et accepte ceux-là : **un compte créé avec `&` ou `'` dans son mot de passe ne pourra jamais se connecter.** Autre écart : `isValidCredential` fait un `trim()` sur le mot de passe saisi, ce que l'inscription ne fait pas.
- **P1** `ComptePostController.php:68` écrit **le mot de passe en clair dans les logs**.
- **P2** `RecettePostController.php:52-56` : le filtre « anti-injection SQL » par mots-clés ne sert à rien (les requêtes sont préparées) et bloquerait des textes légitimes. `RecettePutController` ne valide ni `ingredients` ni `lien`, et aucune URL n'est vérifiée pour `lien` (un `javascript:` peut finir dans l'`iframe`).
- **P2** `CategoriePostController.php:38` enregistre le nom après `htmlspecialchars` : encodage en base, puis double encodage à l'affichage.
- **P2** `RoleGetController.php:12` : `$pk` n'est jamais rempli depuis le formulaire, donc la branche « un seul rôle » est inatteignable.
- **P2** `ComptePutController.php:74` appelle `new Compte("tmp@mail.com", ...)` alors que le constructeur ne prend aucun argument.
- **P2** `CommentaireDeleteController` force `fk_compte` à l'utilisateur connecté : un admin ne peut pas supprimer le commentaire d'un autre, alors que le service le permet.
- **P2** `AbstractController.php:15` crée la propriété dynamique `controllerName` (dépréciée depuis PHP 8.2).
- **P2** Codes HTTP non standard : 499 « Already Authenticated » (`LoginPostController`, `ComptePostController`), 405 pour un conflit de FK.
- **P2** Une même notion porte des noms différents selon la route : `pk` (`Categorie GET`, `Recette GET`) contre `pk_categorie` / `pk_recette` (DELETE, PUT) ; `pk_recette` (`Favori GET`, `Note GET`) contre `fk_recette` (POST, DELETE).

### 4.5 Entités

- `AbstractEntity::jsonSerialize()` expose **toutes** les propriétés privées. `Compte` publie ainsi `email` et `motDePasse` : ce dernier est vide aujourd'hui, mais le hash serait publié si l'entité était chargée avec `keepMotDePasse = true`. Les `DateTime` sortent sous forme d'objet `{date, timezone_type, timezone}`.
- `Compte::create()` et les setters de `Compte` lèvent des `InvalidArgumentException` que `api.php` ne gère pas.
- `CategorieRecette`, `Favori`, `Note` et `Commentaire::createFromRow` testent `pk_recette` / `pk_compte`, qui n'existent jamais dans ces lignes (les colonnes s'appellent `fk_*`). Ces branches sont mortes, et le chargement des objets liés repose entièrement sur les DAO.

### 4.6 Encodage

- **P1** `BddSingleton.php:19, 29` utilise `charset=utf8` et `SET NAMES utf8` (c'est-à-dire utf8mb3), alors que les tables sont en `utf8mb4`. Les émojis sur 4 octets (recettes 1 et 20) reviennent en `?`, et un commentaire contenant un émoji provoque une erreur 1366 à l'insertion. Il faut utiliser `utf8mb4` partout.

---

## 5. Sécurité

| Gravité | Constat | Où |
|---|---|---|
| P1 | **XSS stocké** : le contenu des commentaires n'est ni filtré ni modéré (§4.3) et il est injecté via `innerHTML`. Même chose pour le nom, les ingrédients et les détails des recettes, et pour les noms de catégories. | `recetteDetail.js:34-76, 291-294`, `recettes.js:105-108`, `formulaireRecette.js:31-36` |
| P1 | **Fuite de données personnelles** : chaque recette et chaque commentaire publics embarquent l'objet `compte` complet, y compris l'**email** de l'auteur. | `RecetteDao.php:31-33`, `CommentaireDao.php:34-40`, `AbstractEntity.php` |
| P1 | **CSRF** : le cookie de session n'a ni `HttpOnly` ni `SameSite` (§4.1), et l'API accepte `application/x-www-form-urlencoded` sans vérifier le `Content-Type` ni utiliser de jeton. Toutes les routes POST/PUT/DELETE sont exposées. Combiné à la XSS, le cookie de session peut aussi être volé. | `api.php`, `fetch.js:29-33` |
| P1 | Mot de passe en clair dans `error_log`. | `ComptePostController.php:68` |
| P1 | Bannir un compte réinitialise silencieusement son mot de passe. | §4.3 |
| P2 | Messages d'erreur SQL bruts renvoyés au client. | `CategorieDao.php:103`, `NoteDao.php:155` |
| P2 | Identifiants internes dans les messages d'erreur (« Compte avec l'ID 12 est banni »). | `CompteDao.php:95-102` |
| P2 | `lien` est injecté tel quel dans `<iframe src>`. | `recetteDetail.js:67` |
| P2 | Aucune limite au nombre de tentatives de connexion. | `LoginPostController` |

Points positifs : toutes les requêtes SQL observées sont préparées (PDO avec `ATTR_EMULATE_PREPARES = false`). Les noms de table et de colonne concaténés dans `AbstractDao` viennent de constantes du code. La route est validée par une regex avant le `require` dynamique (`functions.php:163`). Le login appelle `session_regenerate_id(true)`.

---

## 6. Déconnexions entre frontend et backend

### 6.1 Format des échanges (non conforme à `CLAUDE.md`)

- **Transport.** `CLAUDE.md` impose du JSON dans les deux sens. Le front envoie du `application/x-www-form-urlencoded` (`fetch.js:29, 33`) et le back lit `$_POST` ou `parse_str` (`functions.php:139-153`). Passer au JSON demandera de modifier les deux côtés ; seul `CommentairePutController` lit déjà `php://input` en JSON.
- **Réponses de succès.** Aucune n'a la forme `{"success": true, "data": ...}`. On trouve trois variantes :
  - objet ou tableau brut : `Categorie`, `Recette`, `Commentaire GET`, `Compte GET`, `Session` ;
  - `{"success": true, "message": ...}` : Favori, Note, Commentaire POST/PUT/DELETE, Login ;
  - `{"status": "success", ...}` : Compte POST/PUT/DELETE, Logout.
- **Réponses d'erreur.** Soit `{"error": "..."}` sans `"success": false` ni `Content-Type`, soit une page vide pour les erreurs fatales.
- **Point d'attention.** Le front lit directement les clés métier (`sessionInfo.isLogged`, `data.estFavori`, `data.moyenne`, tableaux bruts). **Mettre le back en conformité impose de lire `data.data` dans chaque callback**, ou de déballer la réponse une seule fois dans `defaultResponseCallback`.

### 6.2 Appel par appel

| Fichier front | Appel | Attendu par le front | Renvoyé ou fait par le back | Écart |
|---|---|---|---|---|
| `script.js:19-58` | `GET Session` | `isLogged`, `pseudo` | idem | OK (`startTime` null, §4.1) |
| `compte.js:43-65` | `POST Login` | succès ou `error.message` | idem | Mots de passe contenant `& < > " '` refusés (§4.4) |
| `compte.js:67-98` | `POST Compte` | succès | `{"status":"success","pk"}` | `password_confirm` est envoyé et ignoré (sans gravité). La règle de mot de passe (12 caractères, majuscule, minuscule, caractère spécial) n'est pas expliquée côté front, qui n'affiche que « param mot_de_passe est invalide ». |
| `compte.js:100-107` | `GET Logout` | JSON | `TypeError`, 500 vide | §3.6 |
| `formulaireRecette.js:27-43` | `GET Categorie` | `[{pk_categorie, nom}]` | idem | OK |
| `formulaireRecette.js:58-76` | `POST Recette` | clé `data["recette n°"]` (l.68) | ParseError ; une fois corrigé, clé `pk_recette` | **Les clés diffèrent** : les catégories supplémentaires partent avec `fk_recette=undefined` (400 silencieux). Le formulaire n'a pas de champ `image` alors que la colonne est obligatoire, ni de champ `lien`. |
| `formulaireRecette.js:80-104` | `POST CategorieRecette` | succès | OK si `fk_recette` est valide | Dépend de la ligne précédente |
| `recettes.js:57-67` | `GET Recette[&categories=]` | tableau de recettes | tableau | OK. Un admin voit toutes les recettes sans filtre, mais seulement les approuvées avec un filtre. |
| `recetteDetail.js:15-24` | `GET Recette&pk=` | recette | recette | `lien` est une URL `watch?v=`, que YouTube refuse d'afficher dans une `iframe` (il faut `/embed/ID`). Les ingrédients et détails s'affichent sans retours à la ligne. |
| `recetteDetail.js:86-101` | `GET Favori&pk_recette=` | `{estFavori}` | `Error` fatale (§3.5) | Bouton toujours désactivé, même connecté |
| `recetteDetail.js:120-132` | `POST Favori` | succès | `PDOException` (§3.4) | 500 vide |
| `recetteDetail.js:134-142` | `DELETE Favori&fk_recette=` | succès | 500 JSON (table inexistante) | |
| `recetteDetail.js:146-158` | `GET Note&pk_recette=` | `{moyenne}` | Erreur fatale (§3.2) ; une fois corrigé, le nombre de notes | Mauvaise valeur (§4.4) |
| `recetteDetail.js:210-225` | `POST Note` | succès | Erreur fatale | Un 2ᵉ vote renverrait 400 « déjà noté » : le front devrait appeler `PUT` (`mettreAJourNote`, jamais utilisée). |
| `recetteDetail.js:229-242, 279-297` | `GET Commentaire&fk_recette=` | `c.pseudo`, `c.date_creation` (chaîne) | 403 (§3.10) ; sinon `c.compte.pseudo` et `c.date_creation = {date, timezone…}` | Auteur toujours « Utilisateur », date « [object Object] », commentaires non approuvés affichés. |
| `recetteDetail.js:244-277` | `POST Commentaire` | succès | OK (date fausse, §4.1) | Formulaire affiché aux visiteurs non connectés (401 à l'envoi) |
| `accueil.js` (tout le fichier) | `GET Session` → `afficheLoginZone` | `#loginArea` | — | Module jamais importé. Il crée `#login-area` alors que `compte.js:5` cherche `#loginArea`, il appelle `window.formulaireRecette` qui n'existe pas (le global s'appelle `window.partager`), et il affiche la marque « Cook & Share » au lieu de « Le Carnet Gourmand ». |

### 6.3 DOM et interface

- `script.js:87` et `index.html:50` créent deux éléments `id="footerPartager"`. L'écouteur (`script.js:121`) se fixe sur le premier dans le DOM, celui du `<main>`, qui est détruit dès qu'on change de page. Résultat : le lien « Partager une recette » du footer ne marche jamais, et celui de l'accueil seulement au premier affichage.
- `recettes.js:12` : `<div id="recetteCount" </div>` est une balise mal fermée, et place un `div` dans un `h2`.
- `recettes.js:6` initialise `perPage = "all"` alors que la liste déroulante (l.22) affiche « 20 ».
- `modal.js:2` met `display:block` alors que la CSS prévoit la classe `.open` (`display:flex`) : la modale n'est plus centrée.
- `#toast` (`index.html:68`) n'est jamais utilisé, et `import { afficheLoginZone }` est inutile dans `script.js:4`.
- `fetch.js:4` appelle `response.json()` sans vérifier le `Content-Type` : toute erreur PHP non JSON devient « Unexpected end of JSON input ».

---

## 7. Non-conformités à `CLAUDE.md`

| Règle | Statut | Détail |
|---|---|---|
| Un DAO ne fait que du SQL, sans logique métier | Partiel | `CompteDao::findByPk` applique des règles métier (banni ou supprimé → 403). `CompteDao::isValidCredential` vérifie le mot de passe. `CompteDao::insert/update` hashent. `RecetteDao::insert` gère les catégories. |
| Aucun SQL direct dans un contrôleur | Respecté | Aucune requête SQL dans `controllers/`. En revanche, certains contrôleurs refont les contrôles de droits du service (`RecettePutController.php:83-86`) et instancient d'autres services. |
| Front et back communiquent uniquement via `api.php`, en JSON | Non | Transport en `x-www-form-urlencoded` (§6.1) |
| Format `{"success": true, "data": ...}` / `{"success": false, "error": ...}` | Non | §6.1 |
| Vérifier l'en-tête `Content-Type: application/json` | Non | Aucun contrôle de l'en-tête des requêtes, et pas d'en-tête sur les réponses d'erreur |
| Requêtes préparées PDO | Respecté | — |
| `index.php` comme point d'entrée | Non | Fichier absent (§1) |
| `/exceptions` pour une gestion centralisée des erreurs | Partiel | §1 et §3.9 |

---

## 8. Code mort

- `utils/functions.php` : `headerAndDie`, `destroy_Session`, `hashPassword`, `isNaturalInteger`, `isSanitizedContent`, `getSanitizedString`, `checkFormElement`, `getWord`, `getBoolean`. `isPseudo()` renvoie toujours `true`.
- `utils/sessioninfo/*` (`ISessionInfoProvider`, `BaseSessionInfoProvider`), ainsi que `SessionManager::getCompteFromSession` et `SessionManager::createISessionInfoProvider`.
- `CompteService::findByPkForSession`, `NoteService::dejaNote`, `CommentaireDao::recetteExists`, `CompteService::restore` (non exposé).
- `public/js/accueil.js`, `compte.js::afficheLoginZone`, `recetteDetail.js::mettreAJourNote`.
- `AbstractController.php:49-64` : ancienne version de `processResponse` laissée en commentaire.

---

## 9. Plan de correction proposé (par ordre)

1. **Rendre l'API démarrable.** Configurer la BDD (§3.8), passer en `utf8mb4`, ajouter dans `api.php` un gestionnaire global d'exceptions qui renvoie toujours `{"success": false, "error": ...}` avec le `Content-Type`, et retirer `E_STRICT`.
2. **Corriger les P0 PHP.** Syntaxe de `RecettePostController`, signatures de `NoteDao` et `NoteService`, table `favori`, `FavoriService::estFavori()`, `LogoutGetController::processResponse()`, remplacement des `_403_Forbidden()` des services par des `HttpStatusException` (corrige §3.10), format de date `Y-m-d H:i:s`, `case 409`.
3. **Schéma SQL.** Clés primaires composites sur les quatre tables d'association, `pk_commentaire`, `UNIQUE(email)` et `UNIQUE(pseudo)`, `image` nullable ou image par défaut, alignement `roles.nom` ↔ `Role::$role`, comptes de démo avec mot de passe hashé, suppression du doublon 53/60.
4. **Données et droits.**
   - Ne plus lever 403 dans `CompteDao::findByPk` : prévoir une méthode dédiée à l'authentification.
   - Séparer la mise à jour du mot de passe et le bannissement dans `CompteDao`.
   - Filtrer `est_approuve` pour les commentaires publics.
   - Ne plus sérialiser `email` ni `motDePasse` dans les objets publics (DTO ou `jsonSerialize` dédié).
   - Renvoyer les dates sous forme de chaînes.
5. **Contrat d'API.** Envelopper les réponses en `{success, data}` dans `AbstractController::processResponse`, harmoniser les noms de paramètres, compléter `API_CONTRACT.md`, puis adapter `fetch.js` (déballage de `data`, envoi en JSON, vérification du `Content-Type`).
6. **Frontend.**
   - Lire la clé `pk_recette` après création d'une recette.
   - Afficher `c.compte.pseudo` et une date formatée dans les commentaires.
   - Appeler `PUT Note` quand l'utilisateur a déjà voté.
   - Échapper systématiquement le HTML (`textContent` ou une fonction `escapeHtml`).
   - Convertir les liens YouTube en URL `/embed/`.
   - Ajouter le champ image, brancher le menu mobile, supprimer les ids en double et `accueil.js`.
7. **Performance.** Remplacer les requêtes N+1 par une jointure `recettes ⋈ comptes`, et regrouper l'insertion recette + catégories dans une transaction.
