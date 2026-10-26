<?php

require_once(ROOT . "/controllers/AbstractController.php");
require_once(ROOT . "/controllers/IController.php");
require_once(ROOT . "/entities/Compte.php");
require_once(ROOT . "/services/CompteService.php");
require_once(ROOT . "/exceptions/BadRequestException.php");

// POST api.php?route=Compte {"email", "pseudo", "mot_de_passe"} : inscription
class ComptePostController extends AbstractController implements IController
{
    private CompteService $compteService;
    private string $email;
    private string $pseudo;
    private string $motDePasse;

    public function __construct(array $form)
    {
        parent::__construct($form);
        $this->compteService = new CompteService();
    }

    protected function checkForm(): void
    {
        $this->requireParams("email", "pseudo", "mot_de_passe");
    }

    protected function checkCybersec(): void
    {
        $this->email = $this->getString("email", 3, 100);
        if (!isEmail($this->email)) {
            throw new BadRequestException("Adresse email invalide.");
        }

        $this->pseudo = $this->getString("pseudo", 3, 50);
        if (!isPseudo($this->pseudo)) {
            throw new BadRequestException("Le pseudo ne peut contenir que des lettres, des chiffres, des espaces et . _ -");
        }

        $this->motDePasse = $this->getPassword("mot_de_passe");
        if (!isPassword($this->motDePasse)) {
            throw new BadRequestException(
                "Le mot de passe doit contenir de 12 à 72 caractères, dont une majuscule, une minuscule et un caractère spécial."
            );
        }
    }

    protected function checkRights(): void
    {
        // Inscription ouverte ; le service refuse si l'on est déjà connecté
    }

    protected function processRequest(): void
    {
        $compte = Compte::create($this->email, $this->pseudo, $this->motDePasse);
        $this->compteService->insert($compte);

        $this->statusCode = 201;
        $this->response = $compte;
    }
}
?>
