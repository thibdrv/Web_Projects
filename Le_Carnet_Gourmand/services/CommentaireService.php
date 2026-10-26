<?php

require_once(ROOT . "/services/IService.php");
require_once(ROOT . "/services/AbstractService.php");
require_once(ROOT . "/services/AuthService.php");
require_once(ROOT . "/services/RecetteService.php");
require_once(ROOT . "/entities/IEntity.php");
require_once(ROOT . "/entities/Commentaire.php");
require_once(ROOT . "/daos/CommentaireDao.php");
require_once(ROOT . "/exceptions/ConflictException.php");
require_once(ROOT . "/exceptions/ForbiddenException.php");
require_once(ROOT . "/exceptions/NotFoundException.php");

// Un commentaire est publié après validation par un administrateur.
// Avant cela, seuls son auteur et les administrateurs le voient.
class CommentaireService extends AbstractService implements IService
{
    private RecetteService $recetteService;

    public function __construct() {
        $this->dao = new CommentaireDao();
        $this->recetteService = new RecetteService();
    }

    function getDao(): CommentaireDao {
        return $this->dao;
    }

    // Liste de modération : administrateurs seulement ($estApprouve = false pour les commentaires en attente)
    function findAll(?bool $estApprouve = null): array {
        AuthService::requireAdmin();
        return $this->getDao()->findAll($estApprouve);
    }

    // Commentaires d'une recette visible : les approuvés, plus ceux en attente de l'utilisateur connecté
    // (un administrateur voit tout)
    function findByRecette(int $fkRecette): array {
        $this->recetteService->findByPk($fkRecette);
        $moi = AuthService::currentUser();
        return $this->getDao()->findByRecette($fkRecette, !AuthService::isAdmin(), $moi?->getPkCompte());
    }

    // $pk = ['fk_compte' => X, 'fk_recette' => Y]
    function findByPk(int|array $pk): Commentaire {
        $commentaire = $this->getDao()->findByPk($pk);
        if ($commentaire === null
            || $commentaire->getEstSupprime()
            || (!$commentaire->getEstApprouve() && !AuthService::canManage($commentaire->getFkCompte()))) {
            throw new NotFoundException("Commentaire introuvable.");
        }
        $this->recetteService->findByPk($commentaire->getFkRecette());
        return $commentaire;
    }

    // Un commentaire par compte et par recette publiée ; il attend ensuite la validation
    function insert(IEntity $entity): int {
        /** @var Commentaire $entity */
        $moi = AuthService::requireUser();
        $this->recetteService->findPublished($entity->getFkRecette());

        $entity->setFkCompte($moi->getPkCompte());
        $entity->setDateCreation(new DateTime());
        $entity->setEstApprouve(false);
        $entity->setEstSupprime(false);

        $existant = $this->getDao()->findByPk($entity->getPk());
        if ($existant !== null && !$existant->getEstSupprime()) {
            throw new ConflictException("Vous avez déjà commenté cette recette : modifiez votre commentaire avec PUT.");
        }
        if ($existant !== null) {
            // La table n'a pas d'identifiant propre : un ancien commentaire supprimé est réutilisé
            $this->getDao()->update($entity);
            return 1;
        }
        return $this->getDao()->insert($entity);
    }

    // $entity contient l'état voulu ; il est comparé à la version en base :
    //  - contenu : modifiable par l'auteur seulement, le commentaire repasse alors en validation
    //    (sauf si l'auteur est administrateur)
    //  - est_approuve : modifiable par un administrateur seulement (modération)
    function update(IEntity $entity): Commentaire {
        /** @var Commentaire $entity */
        $moi = AuthService::requireUser();
        $avant = $this->findByPk($entity->getPk());
        $estAuteur = $moi->getPkCompte() === $avant->getFkCompte();
        $changeContenu = $entity->getContenu() !== $avant->getContenu();
        $changeStatut = $entity->getEstApprouve() !== $avant->getEstApprouve();

        if ($changeContenu && !$estAuteur) {
            throw new ForbiddenException("Seul l'auteur peut modifier le texte de son commentaire.");
        }
        if ($changeStatut && !$moi->isAdmin()) {
            throw new ForbiddenException("Seul un administrateur peut approuver ou refuser un commentaire.");
        }

        if ($changeContenu) {
            $avant->setContenu($entity->getContenu());
            if (!$moi->isAdmin()) {
                $avant->setEstApprouve(false);
            }
        }
        if ($changeStatut) {
            $avant->setEstApprouve($entity->getEstApprouve());
        }

        $this->getDao()->update($avant);
        return $avant;
    }

    // Suppression logique par l'auteur ou un administrateur
    function delete(int|array $pk): void {
        AuthService::requireUser();
        $commentaire = $this->findByPk($pk);
        if (!AuthService::canManage($commentaire->getFkCompte())) {
            throw new ForbiddenException("Vous ne pouvez supprimer que vos propres commentaires.");
        }
        $this->getDao()->delete($commentaire->getPk());
    }
}
?>
