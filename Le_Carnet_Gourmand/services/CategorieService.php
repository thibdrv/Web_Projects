<?php

require_once(ROOT . "/services/IService.php");
require_once(ROOT . "/services/AbstractService.php");
require_once(ROOT . "/services/AuthService.php");
require_once(ROOT . "/entities/IEntity.php");
require_once(ROOT . "/entities/Categorie.php");
require_once(ROOT . "/daos/CategorieDao.php");
require_once(ROOT . "/daos/CategorieRecetteDao.php");
require_once(ROOT . "/exceptions/ConflictException.php");

class CategorieService extends AbstractService implements IService
{
    private CategorieRecetteDao $categorieRecetteDao;

    public function __construct() {
        $this->dao = new CategorieDao();
        $this->categorieRecetteDao = new CategorieRecetteDao();
    }

    function getDao(): CategorieDao {
        return $this->dao;
    }

    // Lecture publique
    function findByPk(int|array $pk): Categorie {
        return $this->findOrFail($pk, "Catégorie introuvable.");
    }

    function insert(IEntity $entity): int {
        AuthService::requireAdmin();
        /** @var Categorie $entity */
        $this->checkNomDisponible($entity->getNom(), null);

        $pk = $this->getDao()->insert($entity);
        $entity->setPkCategorie($pk);
        return $pk;
    }

    function update(IEntity $entity): Categorie {
        AuthService::requireAdmin();
        /** @var Categorie $entity */
        $this->findByPk($entity->getPkCategorie());
        $this->checkNomDisponible($entity->getNom(), $entity->getPkCategorie());

        $this->getDao()->update($entity);
        return $this->findByPk($entity->getPkCategorie());
    }

    // Une catégorie encore utilisée par des recettes ne peut pas être supprimée
    function delete(int|array $pk): void {
        AuthService::requireAdmin();
        $categorie = $this->findByPk($pk);

        $nbRecettes = $this->categorieRecetteDao->countByCategorie($categorie->getPkCategorie());
        if ($nbRecettes > 0) {
            throw new ConflictException("Impossible de supprimer la catégorie : $nbRecettes recette(s) l'utilisent encore.");
        }
        $this->getDao()->delete($categorie->getPkCategorie());
    }

    // `categories.nom` est UNIQUE en base
    private function checkNomDisponible(string $nom, ?int $pkActuel): void {
        $existante = $this->getDao()->findByNom($nom);
        if ($existante !== null && $existante->getPkCategorie() !== $pkActuel) {
            throw new ConflictException("La catégorie « $nom » existe déjà.");
        }
    }
}
?>
