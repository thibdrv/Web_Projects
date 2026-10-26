<?php

require_once(ROOT . "/controllers/AbstractController.php");
require_once(ROOT . "/controllers/IController.php");
require_once(ROOT . "/services/CompteService.php");
require_once(ROOT . "/services/AuthService.php");
require_once(ROOT . "/exceptions/BadRequestException.php");

// POST api.php?route=Login {"email", "mot_de_passe"}
class LoginPostController extends AbstractController implements IController
{
    private CompteService $compteService;
    private string $email;
    private string $motDePasse;

    public function __construct(array $form)
    {
        parent::__construct($form);
        $this->compteService = new CompteService();
    }

    protected function checkForm(): void
    {
        $this->requireParams("email", "mot_de_passe");
    }

    protected function checkCybersec(): void
    {
        $this->email = $this->getString("email", 3, 100);
        if (!isEmail($this->email)) {
            throw new BadRequestException("Adresse email invalide.");
        }
        // Le mot de passe n'est ni nettoyé ni filtré : il est seulement comparé au hash
        $this->motDePasse = $this->getPassword("mot_de_passe");
    }

    protected function checkRights(): void
    {
        // Pas besoin d'être connecté pour se connecter
    }

    protected function processRequest(): void
    {
        $compte = $this->compteService->authenticate($this->email, $this->motDePasse);
        AuthService::login($compte);
        $this->response = $compte;
    }
}
?>
