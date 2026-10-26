<?php

require_once(ROOT . "/services/IService.php");
require_once(ROOT . "/services/AbstractService.php");
require_once(ROOT . "/services/AuthService.php");
require_once(ROOT . "/services/RecetteService.php");
require_once(ROOT . "/entities/IEntity.php");
require_once(ROOT . "/entities/Note.php");
require_once(ROOT . "/daos/NoteDao.php");
require_once(ROOT . "/exceptions/BadRequestException.php");
require_once(ROOT . "/exceptions/ConflictException.php");
require_once(ROOT . "/exceptions/ForbiddenException.php");
require_once(ROOT . "/exceptions/NotFoundException.php");

class NoteService extends AbstractService implements IService
{
    public const NOTE_MIN = 0;
    public const NOTE_MAX = 5;

    private RecetteService $recetteService;

    public function __construct() {
        $this->dao = new NoteDao();
        $this->recetteService = new RecetteService();
    }

    function getDao(): NoteDao {
        return $this->dao;
    }

    // Note sur 5, par demi-points
    private function checkNote(?float $note): void {
        if ($note === null || $note < self::NOTE_MIN || $note > self::NOTE_MAX || fmod($note * 2, 1.0) !== 0.0) {
            throw new BadRequestException("La note doit être comprise entre 0 et 5, par pas de 0,5.");
        }
    }

    // Moyenne et nombre de notes d'une recette visible (consultable sans être connecté),
    // plus la note du compte connecté s'il en a donné une
    function statistiques(int $fkRecette): array {
        $this->recetteService->findByPk($fkRecette);
        $stats = $this->getDao()->statsByRecette($fkRecette);

        $maNote = null;
        $moi = AuthService::currentUser();
        if ($moi !== null) {
            $maNote = $this->getDao()->findByPk(['fk_compte' => $moi->getPkCompte(), 'fk_recette' => $fkRecette])?->getNote();
        }

        return [
            "fk_recette" => $fkRecette,
            "moyenne" => $stats->moyenne === null ? null : round((float)$stats->moyenne, 1),
            "nombre_notes" => (int)$stats->nombre_notes,
            "ma_note" => $maNote,
        ];
    }

    // Notes données par le compte connecté
    function findMine(): array {
        $moi = AuthService::requireUser();
        return $this->getDao()->findByCompte($moi->getPkCompte());
    }

    // Toutes les notes de tous les comptes : administrateurs seulement
    function findAll(): array {
        AuthService::requireAdmin();
        return $this->getDao()->findAll();
    }

    function findByPk(int|array $pk): Note {
        if (!is_array($pk) || !AuthService::canManage(isset($pk['fk_compte']) ? (int)$pk['fk_compte'] : null)) {
            throw new ForbiddenException("Vous ne pouvez consulter que vos propres notes.");
        }
        return $this->findOrFail($pk, "Aucune note pour cette recette.");
    }

    // Première note du compte connecté sur une recette publiée
    function insert(IEntity $entity): int {
        /** @var Note $entity */
        $moi = AuthService::requireUser();
        $this->checkNote($entity->getNote());
        $entity->setFkCompte($moi->getPkCompte());
        $this->recetteService->findPublished($entity->getFkRecette());

        if ($this->getDao()->findByPk($entity->getPk()) !== null) {
            throw new ConflictException("Vous avez déjà noté cette recette : modifiez votre note avec PUT.");
        }
        return $this->getDao()->insert($entity);
    }

    // Modification de la note du compte connecté
    function update(IEntity $entity): Note {
        /** @var Note $entity */
        $moi = AuthService::requireUser();
        $this->checkNote($entity->getNote());
        $entity->setFkCompte($moi->getPkCompte());
        $this->recetteService->findPublished($entity->getFkRecette());

        if ($this->getDao()->findByPk($entity->getPk()) === null) {
            throw new NotFoundException("Vous n'avez pas encore noté cette recette : utilisez POST.");
        }
        $this->getDao()->update($entity);
        return $entity;
    }

    // $pk : identifiant de la recette (ou ['fk_recette' => X]) ; le compte est toujours celui connecté
    function delete(int|array $pk): void {
        $moi = AuthService::requireUser();
        $fkRecette = is_array($pk) ? (int)($pk['fk_recette'] ?? 0) : $pk;

        $supprime = $this->getDao()->delete(['fk_compte' => $moi->getPkCompte(), 'fk_recette' => $fkRecette]);
        if (!$supprime) {
            throw new NotFoundException("Vous n'avez pas noté cette recette.");
        }
    }
}
?>
