<?php

require_once(ROOT . "/services/IService.php");
require_once(ROOT . "/services/AbstractService.php");
require_once(ROOT . "/services/AuthService.php");
require_once(ROOT . "/services/RecetteService.php");
require_once(ROOT . "/entities/IEntity.php");
require_once(ROOT . "/entities/Favori.php");
require_once(ROOT . "/daos/FavoriDao.php");
require_once(ROOT . "/exceptions/ConflictException.php");
require_once(ROOT . "/exceptions/ForbiddenException.php");
require_once(ROOT . "/exceptions/MethodNotAllowedException.php");
require_once(ROOT . "/exceptions/NotFoundException.php");

// Les favoris sont privés : chacun ne voit et ne gère que les siens
class FavoriService extends AbstractService implements IService
{
    private RecetteService $recetteService;

    public function __construct() {
        $this->dao = new FavoriDao();
        $this->recetteService = new RecetteService();
    }

    function getDao(): FavoriDao {
        return $this->dao;
    }

    // Tous les favoris de tous les comptes : administrateurs seulement
    function findAll(): array {
        AuthService::requireAdmin();
        return $this->getDao()->findAll();
    }

    function findByPk(int|array $pk): Favori {
        if (!is_array($pk) || !AuthService::canManage(isset($pk['fk_compte']) ? (int)$pk['fk_compte'] : null)) {
            throw new ForbiddenException("Vous ne pouvez consulter que vos propres favoris.");
        }
        return $this->findOrFail($pk, "Cette recette n'est pas dans les favoris.");
    }

    // Favoris du compte connecté, avec les recettes qu'il a le droit de voir
    function findMine(): array {
        $moi = AuthService::requireUser();
        $favoris = array_values(array_filter(
            $this->getDao()->findByCompte($moi->getPkCompte()),
            fn(Favori $favori) => $this->recetteService->isVisible($favori->getRecette())
        ));
        $this->recetteService->withCategories(array_map(fn(Favori $favori) => $favori->getRecette(), $favoris));
        return $favoris;
    }

    function estFavori(int $fkRecette): bool {
        $moi = AuthService::requireUser();
        return $this->getDao()->exists($moi->getPkCompte(), $fkRecette);
    }

    // Ajout d'une recette publiée aux favoris du compte connecté
    function insert(IEntity $entity): int {
        /** @var Favori $entity */
        $moi = AuthService::requireUser();
        $entity->setFkCompte($moi->getPkCompte());
        $this->recetteService->findPublished($entity->getFkRecette());

        if ($this->getDao()->exists($moi->getPkCompte(), $entity->getFkRecette())) {
            throw new ConflictException("Cette recette est déjà dans vos favoris.");
        }
        return $this->getDao()->insert($entity);
    }

    function update(IEntity $entity): IEntity {
        throw new MethodNotAllowedException("Un favori ne se modifie pas.");
    }

    // $pk : identifiant de la recette (ou ['fk_recette' => X]) ; le compte est toujours celui connecté
    function delete(int|array $pk): void {
        $moi = AuthService::requireUser();
        $fkRecette = is_array($pk) ? (int)($pk['fk_recette'] ?? 0) : $pk;

        $supprime = $this->getDao()->delete(['fk_compte' => $moi->getPkCompte(), 'fk_recette' => $fkRecette]);
        if (!$supprime) {
            throw new NotFoundException("Cette recette n'est pas dans vos favoris.");
        }
    }
}
?>
