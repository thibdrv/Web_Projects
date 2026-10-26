<?php

require_once(ROOT . "/controllers/AbstractController.php");
require_once(ROOT . "/controllers/IController.php");
require_once(ROOT . "/services/CompteService.php");
require_once(ROOT . "/services/AuthService.php");

// DELETE api.php?route=Compte&pk_compte=X : suppression logique (titulaire ou administrateur)
class CompteDeleteController extends AbstractController implements IController
{
    private CompteService $compteService;
    private int $pkCompte;

    public function __construct(array $form)
    {
        parent::__construct($form);
        $this->compteService = new CompteService();
    }

    protected function checkForm(): void
    {
        $this->alias("pk_compte", "pk");
        $this->requireParams("pk_compte");
    }

    protected function checkCybersec(): void
    {
        $this->pkCompte = $this->getId("pk_compte");
    }

    protected function checkRights(): void
    {
        AuthService::requireUser();
    }

    protected function processRequest(): void
    {
        $this->compteService->delete($this->pkCompte);

        // Le titulaire qui supprime son propre compte est déconnecté
        if (AuthService::currentUser()?->getPkCompte() === $this->pkCompte) {
            AuthService::logout();
        }
        $this->response = ["pk_compte" => $this->pkCompte];
    }
}
?>
