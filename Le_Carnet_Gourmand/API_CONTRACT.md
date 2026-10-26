# Spécification du Contrat d'API

Point d'entrée unique : `api.php?route=<Route>`. La méthode HTTP choisit le contrôleur :
`GET api.php?route=Recette` → `controllers/RecetteGetController.php`.

Prérequis serveur : PHP ≥ 8.1 avec `pdo_mysql` et `mbstring`. Connexion BDD : copier `utils/config.example.php` en `utils/config.php` (ou définir `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASS`).

## Format des requêtes

| Méthode | Où passer les paramètres | En-tête obligatoire |
|---|---|---|
| `GET` | query string : `api.php?route=Recette&pk_recette=3` | — |
| `POST`, `PUT` | `route` dans la query string, le reste dans un **objet JSON** dans le corps | `Content-Type: application/json` |
| `DELETE` | query string (corps JSON facultatif) | `Content-Type: application/json` si un corps est envoyé |

- Un corps qui n'est pas en `application/json` est refusé (**415**). Un JSON invalide, ou qui n'est pas un objet, est refusé (**400**).
- Identifiants : entiers positifs (`3` ou `"3"`). Booléens : `true`/`false`, `1`/`0`, `"true"`/`"false"`, `"1"`/`"0"`.
- Les textes sont enregistrés tels quels (requêtes préparées). **Le frontend doit les échapper à l'affichage** (`textContent`, pas `innerHTML`).
- La session repose sur un cookie `HttpOnly`, `SameSite=Lax`. Elle expire après 45 minutes sans requête.

## Format Standard de Réponse

### Succès (HTTP 200 / 201)
```json
{
  "success": true,
  "data": {}
}
```
`data` contient un objet, une liste ou une valeur selon la route. `201` = ressource créée.

### Échec (HTTP 4xx / 5xx)
```json
{
  "success": false,
  "error": "Message explicite"
}
```

| Code | Signification |
|---|---|
| 400 | Paramètre manquant, mal formé ou invalide |
| 401 | Il faut être connecté (ou identifiants incorrects au login) |
| 403 | Connecté, mais action non autorisée (pas propriétaire, pas admin, compte banni) |
| 404 | Route ou ressource introuvable (une recette non visible est aussi en 404) |
| 405 | La route existe, mais pas pour cette méthode HTTP |
| 409 | Conflit : doublon, déjà connecté, recette non publiée, catégorie encore utilisée... |
| 415 | Corps envoyé sans `Content-Type: application/json` |
| 500 | Erreur interne (le détail est dans les logs serveur, jamais dans la réponse) |
| 503 | Base de données injoignable |

## Objets renvoyés

Les clés sont les noms des colonnes SQL. Les dates sont au format `"AAAA-MM-JJ HH:MM:SS"`.

**Recette**
```json
{
  "pk_recette": 3, "nom": "Gâteau au yaourt", "ingredients": "...", "details": "...",
  "date_creation": "2025-06-13 13:35:36", "date_modification": "2025-09-01 23:12:31",
  "est_approuve": true, "est_supprime": false,
  "image": "public/image/gateau-au-yaourt.webp", "lien": null, "fk_compte": 1,
  "auteur_pseudo": "Herve",
  "categories": [{ "pk_categorie": 3, "nom": "Gâteaux" }]
}
```
`image` vaut `""` sans image. `auteur_pseudo` vaut `null` si le compte auteur est supprimé.

**Categorie** : `{ "pk_categorie", "nom" }`.

**Compte** (jamais de mot de passe ni de hash) :
`{ "pk_compte", "email", "pseudo", "date_creation", "est_banni", "est_supprime", "fk_role", "role_nom" }`.
Rôles : `fk_role = 1` utilisateur, `2` admin.

**Commentaire** : `{ "fk_compte", "fk_recette", "contenu", "date_creation", "est_approuve", "est_supprime", "auteur_pseudo" }`.
La table n'a pas d'identifiant : un commentaire est désigné par le couple (`fk_compte`, `fk_recette`). Il y a donc un commentaire au plus par compte et par recette.

**Note** : `{ "fk_compte", "fk_recette", "note" }`, avec une note de 0 à 5 par pas de 0,5.

**Favori** : `{ "fk_compte", "fk_recette", "recette": Recette | null }`.

**CategorieRecette** : `{ "fk_recette", "fk_categorie", "recette_nom", "categorie_nom" }`.

## Règles de visibilité

- **Recette approuvée** (non supprimée) : visible par tous.
- **Recette non approuvée** : visible seulement par son auteur et par les admins. Pour les autres, elle renvoie 404.
- **Recette supprimée** : suppression logique, invisible pour tout le monde.
- Toute **nouvelle recette** est en attente de validation. Une recette **modifiée par un non-admin** y repasse ; une modification par un admin garde son statut.
- **Commentaire** : publié après approbation par un admin. Avant, seuls son auteur et les admins le voient. Un commentaire modifié par son auteur repasse en attente.
- **Noter, commenter, mettre en favori** : seulement sur une recette publiée (sinon 409).

## Routes

Légende des droits : **public** = sans connexion · **connecté** = 401 sans session · **admin** = 403 si non admin.

### Session

| Méthode | Route et paramètres | Droits | `data` renvoyé |
|---|---|---|---|
| GET | `Session` | public | `{ "est_connecte": bool, "expiration": timestamp \| null, "compte": Compte \| null }` |
| POST | `Login` — `{ "email", "mot_de_passe" }` | public (409 si déjà connecté) | Compte. 401 si identifiants faux, 403 si compte banni. |
| GET | `Logout` | public | `{ "est_connecte": false }` |

### Comptes

| Méthode | Route et paramètres | Droits | `data` renvoyé |
|---|---|---|---|
| POST | `Compte` — `{ "email", "pseudo", "mot_de_passe" }` | public, non connecté (409 sinon) | Compte (201) |
| GET | `Compte&pk_compte=X` | titulaire ou admin | Compte |
| GET | `Compte` | admin | Compte[] (bannis et supprimés compris) |
| PUT | `Compte` — `{ "pk_compte", ... }` | voir ci-dessous | Compte |
| DELETE | `Compte&pk_compte=X` | titulaire ou admin | `{ "pk_compte" }`. Le titulaire est déconnecté. |

Règles de saisie :
- `email` : 100 caractères maximum.
- `pseudo` : 3 à 50 caractères (lettres, chiffres, espace, `.`, `_`, `-`) ; 409 s'il est déjà utilisé.
- `mot_de_passe` : 12 à 72 caractères, avec au moins une majuscule, une minuscule et un caractère spécial.

Ce que chacun peut modifier avec `PUT Compte` :
- **Titulaire** : `pseudo`, `email`, `mot_de_passe`. Changer l'email ou le mot de passe exige `ancien_mot_de_passe` (400 s'il manque, 403 s'il est faux).
- **Admin, sur le compte d'un autre** : `est_banni`, `est_supprime` (`false` = restauration), `fk_role`.

### Rôles

| Méthode | Route et paramètres | Droits | `data` renvoyé |
|---|---|---|---|
| GET | `Role[&pk_role=X]` | admin | Role[] ou Role `{ "pk_role", "nom" }` |

### Catégories

| Méthode | Route et paramètres | Droits | `data` renvoyé |
|---|---|---|---|
| GET | `Categorie[&pk_categorie=X]` | public | Categorie[] (triées par nom) ou Categorie |
| POST | `Categorie` — `{ "nom" }` (2 à 75 caractères) | admin | Categorie (201). 409 si le nom existe déjà. |
| PUT | `Categorie` — `{ "pk_categorie", "nom" }` | admin | Categorie |
| DELETE | `Categorie&pk_categorie=X` | admin | `{ "pk_categorie" }`. 409 si des recettes l'utilisent. |

### Recettes

| Méthode | Route et paramètres | Droits | `data` renvoyé |
|---|---|---|---|
| GET | `Recette&pk_recette=X` | public (visibilité ci-dessus) | Recette |
| GET | `Recette[&fk_categorie=Y][&fk_compte=Z]` | public | Recette[] (plus récentes d'abord). Un admin voit aussi les non approuvées ; l'auteur aussi, avec `fk_compte` = lui-même. |
| POST | `Recette` — `{ "nom", "ingredients", "details", "categories": [1, 2], "image"?, "lien"? }` | connecté | Recette (201), en attente de validation |
| PUT | `Recette` — `{ "pk_recette", "nom"?, "ingredients"?, "details"?, "image"?, "lien"?, "categories"? }` | auteur ou admin | Recette |
| PUT | `Recette` — `{ "pk_recette", "est_approuve": bool }` (seul champ envoyé) | admin | Recette |
| DELETE | `Recette&pk_recette=X` | auteur ou admin | `{ "pk_recette" }` (suppression logique) |

Règles de saisie :
- `nom` : 3 à 100 caractères.
- `ingredients` : 3 à 15 000 caractères ; `details` : 5 à 15 000 caractères.
- `categories` : au moins une catégorie existante. `fk_categorie` (un identifiant ou une liste) est accepté en remplacement.
- `image` : fichier `public/image/<nom>.(webp|png|jpg|jpeg|gif)` ou URL http(s).
- `lien` : URL http(s).

Dans un `PUT` :
- `"categories"` **remplace** toutes les catégories de la recette.
- `"image": ""` efface l'image et `"lien": null` efface le lien.

Anciens noms encore acceptés : `pk` pour `pk_recette`, `categories` pour `fk_categorie` (en GET).

### Liaisons catégorie / recette

| Méthode | Route et paramètres | Droits | `data` renvoyé |
|---|---|---|---|
| GET | `CategorieRecette&fk_recette=X` | public | CategorieRecette[] |
| GET | `CategorieRecette&fk_categorie=Y` | public | CategorieRecette[] (recettes visibles) |
| POST | `CategorieRecette` — `{ "fk_recette", "fk_categorie" }` | auteur de la recette ou admin | CategorieRecette (201). 409 si la liaison existe. |
| DELETE | `CategorieRecette&fk_recette=X&fk_categorie=Y` | auteur de la recette ou admin | `{ "fk_recette", "fk_categorie" }`. 409 s'il s'agit de la dernière catégorie. |

### Favoris (toujours ceux du compte connecté)

| Méthode | Route et paramètres | Droits | `data` renvoyé |
|---|---|---|---|
| GET | `Favori` | connecté | Favori[] avec `recette` |
| GET | `Favori&fk_recette=X` | connecté | `{ "fk_recette", "est_favori": bool }` |
| POST | `Favori` — `{ "fk_recette" }` | connecté | `{ "fk_recette", "est_favori": true }` (201). 409 si déjà en favori. |
| DELETE | `Favori&fk_recette=X` | connecté | `{ "fk_recette", "est_favori": false }`. 404 si absent des favoris. |

Ancien nom encore accepté : `pk_recette` pour `fk_recette`.

### Notes

| Méthode | Route et paramètres | Droits | `data` renvoyé |
|---|---|---|---|
| GET | `Note&fk_recette=X` | public | `{ "fk_recette", "moyenne": float \| null, "nombre_notes": int, "ma_note": float \| null }` |
| GET | `Note` | connecté | Note[] du compte connecté |
| POST | `Note` — `{ "fk_recette", "note" }` | connecté | Note (201). 409 si déjà notée : utiliser PUT. |
| PUT | `Note` — `{ "fk_recette", "note" }` | connecté | Note. 404 si pas encore notée : utiliser POST. |
| DELETE | `Note&fk_recette=X` | connecté | `{ "fk_recette" }` |

Ancien nom encore accepté : `pk_recette` pour `fk_recette`.

### Commentaires

| Méthode | Route et paramètres | Droits | `data` renvoyé |
|---|---|---|---|
| GET | `Commentaire&fk_recette=X` | public | Commentaire[] : les approuvés, plus ceux en attente du compte connecté (un admin voit tout) |
| GET | `Commentaire[&est_approuve=0]` | admin | Commentaire[] (liste de modération) |
| POST | `Commentaire` — `{ "fk_recette", "contenu" }` (2 à 2 000 caractères) | connecté | Commentaire (201), en attente. 409 si l'utilisateur a déjà commenté la recette. |
| PUT | `Commentaire` — `{ "fk_recette", "contenu" }` | auteur | Commentaire (repasse en attente) |
| PUT | `Commentaire` — `{ "fk_recette", "fk_compte", "est_approuve": bool }` | admin | Commentaire |
| DELETE | `Commentaire&fk_recette=X[&fk_compte=Y]` | auteur, ou admin avec `fk_compte` | `{ "fk_compte", "fk_recette" }` |
