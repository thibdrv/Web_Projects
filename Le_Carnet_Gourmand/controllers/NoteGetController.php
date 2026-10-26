<?php

require_once(ROOT . "/controllers/AbstractController.php");
require_once(ROOT . "/controllers/IController.php");
require_once(ROOT . "/services/NoteService.php");
require_once(ROOT . "/services/AuthService.php");

// GET api.php?route=Note&fk_recette=X → {"fk_recette", "moyenne", "nombre_notes", "ma_note"} (public)
// GET api.php?route=Note               → notes données par le compte connecté
class NoteGetController extends AbstractController implements IController
{
    private NoteService $service;
    private ?int $fkRecette = null;

    public function __construct(array $form)
    {
        parent::__construct($form);
        $this->service = new NoteService();
    }

    protected function checkForm(): void
    {
        // ancien nom de paramètre encore utilisé par le frontend
        $this->alias("fk_recette", "pk_recette");
    }

    protected function checkCybersec(): void
    {
        if ($this->has("fk_recette")) {
            $this->fkRecette = $this->getId("fk_recette");
        }
    }

    protected function checkRights(): void
    {
        // La moyenne d'une recette est publique ; la liste de ses propres notes demande d'être connecté
        if ($this->fkRecette === null) {
            AuthService::requireUser();
        }
    }

    protected function processRequest(): void
    {
        $this->response = $this->fkRecette !== null
            ? $this->service->statistiques($this->fkRecette)
            : $this->service->findMine();
    }
}
?>
