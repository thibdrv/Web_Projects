<?php

require_once(ROOT . "/controllers/AbstractController.php");
require_once(ROOT . "/controllers/IController.php");
require_once(ROOT . "/entities/Note.php");
require_once(ROOT . "/services/NoteService.php");
require_once(ROOT . "/services/AuthService.php");

// PUT api.php?route=Note {"fk_recette", "note"} : modifie la note du compte connecté
class NotePutController extends AbstractController implements IController
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
        $this->note = $this->getFloat("note");
    }

    protected function checkRights(): void
    {
        AuthService::requireUser();
    }

    protected function processRequest(): void
    {
        $this->response = $this->service->update(Note::create($this->fkRecette, $this->note));
    }
}
?>
