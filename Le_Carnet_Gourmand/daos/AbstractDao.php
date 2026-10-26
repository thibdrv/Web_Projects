<?php

require_once(ROOT . "/entities/IEntity.php");
require_once(ROOT . "/daos/IDao.php");
require_once(ROOT . "/utils/Database.php");

abstract class AbstractDao implements IDao
{
    abstract function getTableName(): string;

    // Nom de la colonne clé primaire, ou liste des colonnes pour une clé composite
    abstract function getPrimaryKeyName(): string|array;

    abstract function createEntityFromRow(object $row): IEntity;

    protected function db(): Database
    {
        return Database::getInstance();
    }

    function findAll(): array
    {
        $rows = $this->db()->fetchAll("SELECT * FROM " . $this->getTableName());
        return $this->createEntitiesFromRows($rows);
    }

    function findByPk(int|array $pk): ?IEntity
    {
        [$where, $params] = $this->pkCondition($pk);
        $row = $this->db()->fetchOne("SELECT * FROM " . $this->getTableName() . " WHERE " . $where . " LIMIT 1", $params);
        return $row === null ? null : $this->createEntityFromRow($row);
    }

    // Suppression physique (les tables avec est_supprime redéfinissent delete())
    function delete(int|array $pk): bool
    {
        [$where, $params] = $this->pkCondition($pk);
        return $this->db()->execute("DELETE FROM " . $this->getTableName() . " WHERE " . $where, $params) > 0;
    }

    abstract function insert(IEntity $entity): int;

    abstract function update(IEntity $entity): bool;

    protected function createEntitiesFromRows(array $rows): array
    {
        $entities = [];
        foreach ($rows as $row) {
            $entities[] = $this->createEntityFromRow($row);
        }
        return $entities;
    }

    // Construit "col = :col [AND col2 = :col2]" et ses paramètres à partir de la clé primaire.
    // Les noms de colonnes viennent du code (getPrimaryKeyName), jamais de la requête HTTP.
    protected function pkCondition(int|array $pk, string $alias = ""): array
    {
        $columns = (array)$this->getPrimaryKeyName();
        if (!is_array($pk)) {
            if (count($columns) !== 1) {
                throw new InvalidArgumentException(static::class . " attend une clé composite : " . implode(", ", $columns));
            }
            $pk = [$columns[0] => $pk];
        }

        $conditions = [];
        $params = [];
        foreach ($columns as $column) {
            if (!isset($pk[$column])) {
                throw new InvalidArgumentException(static::class . " : valeur manquante pour la clé " . $column);
            }
            $conditions[] = ($alias === "" ? "" : $alias . ".") . $column . " = :" . $column;
            $params[":" . $column] = (int)$pk[$column];
        }
        return [implode(" AND ", $conditions), $params];
    }

    // Vérifie qu'on reçoit bien l'entité gérée par ce DAO
    protected function checkEntity(IEntity $entity, string $class): void
    {
        if (!($entity instanceof $class)) {
            throw new InvalidArgumentException(static::class . " attend une instance de " . $class);
        }
    }

    // Marqueurs ":p0, :p1..." et paramètres pour une clause IN (...)
    protected function inClause(array $values, string $prefix = "p"): array
    {
        $placeholders = [];
        $params = [];
        foreach (array_values($values) as $i => $value) {
            $placeholders[] = ":" . $prefix . $i;
            $params[":" . $prefix . $i] = $value;
        }
        return [implode(", ", $placeholders), $params];
    }
}
?>
