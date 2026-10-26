<?php

require_once(ROOT . "/controllers/AbstractController.php");
require_once(ROOT . "/controllers/IController.php");
require_once(ROOT . "/entities/Note.php");
require_once(ROOT . "/services/NoteService.php");
require_once(ROOT . "/services/AuthService.php");

// POST api.php?route=Note {"fk_recette", "note"} : première note du compte connecté (0 à 5, pas de 0,5)
class NotePostController extends AbstractController implements IController
{
    private NoteService $service;
    private int $fkRecette;
    private float $note;

    public function __construct(array $form)
    {
        parent::__construct($form);
        $this->service = new NoteService();
    }

    protected function checkForm(): void
    {
        $this->requireParams("fk_recette", "note");
    }

    protected function checkCybersec(): void
    {
        $this->fkRecette = $this->getId("fk_recette");
        $this->note = $this->getFloat("note"); // bornes et pas vérifiés par le service
    }

    protected function checkRights(): void
    {
        AuthService::requireUser();
    }

    protected function processRequest(): void
    {
        $note = Note::create($this->fkRecette, $this->note);
        $this->service->insert($note);

        $this->statusCode = 201;
        $this->response = $note;
    }
}
?>
