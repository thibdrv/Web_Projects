<?php

require_once(ROOT . "/entities/IEntity.php");
require_once(ROOT . "/daos/IDao.php");
require_once(ROOT . "/daos/AbstractDao.php");
require_once(ROOT . "/entities/Role.php");

class RoleDao extends AbstractDao implements IDao
{
    function getTableName(): string {
        return "roles";
    }

    function getPrimaryKeyName(): string {
        return "pk_role";
    }

    function createEntityFromRow(object $row): Role {
        return Role::createFromRow($row);
    }

    function findAll(): array {
        $rows = $this->db()->fetchAll("SELECT r.* FROM roles r ORDER BY r.pk_role");
        return $this->createEntitiesFromRows($rows);
    }

    function findByPk(int|array $pk): ?Role {
        return parent::findByPk($pk);
    }

    function insert(IEntity $entity): int {
        $this->checkEntity($entity, Role::class);
        /** @var Role $entity */
        return $this->db()->insert("INSERT INTO roles (nom) VALUES (:nom)", [
            ":nom" => $entity->getNom(),
        ]);
    }

    function update(IEntity $entity): bool {
        $this->checkEntity($entity, Role::class);
        /** @var Role $entity */
        return $this->db()->execute("UPDATE roles SET nom = :nom WHERE pk_role = :pk", [
            ":nom" => $entity->getNom(),
            ":pk" => $entity->getPkRole(),
        ]) > 0;
    }
}
?>
