<?php

require_once(ROOT . "/services/IService.php");
require_once(ROOT . "/services/AbstractService.php");
require_once(ROOT . "/services/AuthService.php");
require_once(ROOT . "/entities/IEntity.php");
require_once(ROOT . "/entities/Role.php");
require_once(ROOT . "/daos/RoleDao.php");
require_once(ROOT . "/exceptions/ForbiddenException.php");

class RoleService extends AbstractService implements IService
{
    public function __construct() {
        $this->dao = new RoleDao();
    }

    function getDao(): RoleDao {
        return $this->dao;
    }

    function findAll(): array {
        AuthService::requireAdmin();
        return $this->getDao()->findAll();
    }

    function findByPk(int|array $pk): Role {
        AuthService::requireAdmin();
        return $this->findOrFail($pk, "Rôle introuvable.");
    }

    // Les rôles sont fixés par le script SQL (1 = utilisateur, 2 = admin)
    function insert(IEntity $entity): int {
        throw new ForbiddenException("La création de rôle est interdite.");
    }

    function update(IEntity $entity): IEntity {
        throw new ForbiddenException("La modification de rôle est interdite.");
    }

    function delete(int|array $pk): void {
        throw new ForbiddenException("La suppression de rôle est interdite.");
    }
}
?>
