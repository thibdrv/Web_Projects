<?php

require_once(ROOT . "/controllers/AbstractController.php");
require_once(ROOT . "/controllers/IController.php");
require_once(ROOT . "/services/NoteService.php");
require_once(ROOT . "/services/AuthService.php");

// DELETE api.php?route=Note&fk_recette=X : retire la note du compte connecté
class NoteDeleteController extends AbstractController implements IController
{
    private NoteService $service;
    private int $fkRecette;

    public function __construct(array $form)
    {
        parent::__construct($form);
        $this->service = new NoteService();
    }

    protected function checkForm(): void
    {
        $this->alias("fk_recette", "pk_recette");
        $this->requireParams("fk_recette");
    }

    protected function checkCybersec(): void
    {
        $this->fkRecette = $this->getId("fk_recette");
    }

    protected function checkRights(): void
    {
        AuthService::requireUser();
    }

    protected function processRequest(): void
    {
        $this->service->delete($this->fkRecette);
        $this->response = ["fk_recette" => $this->fkRecette];
    }
}
?>
