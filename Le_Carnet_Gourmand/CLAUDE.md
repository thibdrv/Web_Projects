# Instructions Projet - Architecture N-Tiers / MVC PHP

## Architecture & Structure des Couches
- `/BDD`: Scripts SQL (schéma de base de données, jeu de données de test)
- `/entities`: Classes PHP représentant les objets métier (Attributs, Getters/Setters)
- `/daos`: Data Access Objects (Requêtes SQL préparées via PDO, accès BDD exclusif)
- `/services`: Logique métier, règles de gestion, validation et orchestration des DAOs
- `/controllers`: Traitement des requêtes HTTP, appel des services, envoi des réponses JSON
- `/exceptions`: Classes d'exceptions personnalisées pour la gestion centralisée des erreurs
- `/utils`: Classes utilitaires (Connexion PDO via Singleton, helpers)
- `/public`: Interface utilisateur frontend (HTML, CSS, JS / Fetch API)
- `api.php`: Point d'entrée et routeur principal de l'API REST
- `index.php`: Point d'entrée principal de l'application web

## Règles Strictes pour l'Agent
1. **Découpage applicatif :** 
   - Un DAO exécute uniquement des requêtes SQL et ne contient aucune logique métier.
   - Un Contrôleur ne réalise aucune requête SQL directe.
   - Le Frontend (`public/`) communique exclusivement avec le Backend via `api.php` en JSON.
2. **Standard des Réponses API :**
   - Succès : `{"success": true, "data": ...}`
   - Échec : `{"success": false, "error": "Message explicite"}`
3. **Sécurité & En-têtes :** Toujours vérifier les en-têtes HTTP (`Content-Type: application/json`) et sécuriser les requêtes contre les injections SQL (requêtes préparées PDO).

## Commandes Utiles
- Serveur PHP local : `php -S localhost:8000`