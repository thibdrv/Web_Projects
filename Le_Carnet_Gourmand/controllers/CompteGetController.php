<?php

require_once(ROOT . "/controllers/AbstractController.php");
require_once(ROOT . "/controllers/IController.php");
require_once(ROOT . "/services/CompteService.php");
require_once(ROOT . "/services/AuthService.php");

// GET api.php?route=Compte[&pk_compte=X]
//  - avec pk_compte : un compte (le sien, ou n'importe lequel pour un administrateur)
//  - sans pk_compte : tous les comptes (administrateurs seulement)
class CompteGetController extends AbstractController implements IController
{
    private CompteService $compteService;
    private ?int $pkCompte = null;

    public function __construct(array $form)
    {
        parent::__construct($form);
        $this->compteService = new CompteService();
    }

    protected function checkForm(): void
    {
        $this->alias("pk_compte", "pk");
    }

    protected function checkCybersec(): void
    {
        if ($this->has("pk_compte")) {
            $this->pkCompte = $this->getId("pk_compte");
        }
    }

    protected function checkRights(): void
    {
        AuthService::requireUser();
    }

    protected function processRequest(): void
    {
        $this->response = $this->pkCompte !== null
            ? $this->compteService->findByPk($this->pkCompte)
            : $this->compteService->findAll();
    }
}
?>
