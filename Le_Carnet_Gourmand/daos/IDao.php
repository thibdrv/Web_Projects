<?php

require_once(ROOT . "/entities/IEntity.php");

// Un DAO exécute uniquement des requêtes SQL : il ne lève jamais d'erreur "métier"
// (introuvable, interdit...). Ces décisions appartiennent aux services.
interface IDao
{
    // null si aucune ligne ne correspond
    function findByPk(int|array $pk): ?IEntity;

    function findAll(): array;

    // Identifiant généré (ou nombre de lignes insérées pour une table sans auto-incrément)
    function insert(IEntity $entity): int;

    // true si la ligne existe
    function update(IEntity $entity): bool;

    // true si une ligne a été supprimée
    function delete(int|array $pk): bool;
}
?>
