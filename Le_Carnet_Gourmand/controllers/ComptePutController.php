<?php

require_once(ROOT . "/controllers/AbstractController.php");
require_once(ROOT . "/controllers/IController.php");
require_once(ROOT . "/services/CompteService.php");
require_once(ROOT . "/services/AuthService.php");
require_once(ROOT . "/exceptions/BadRequestException.php");

// PUT api.php?route=Compte {"pk_compte", ...champs à modifier}
//  - titulaire : "pseudo", "email", "mot_de_passe" ("ancien_mot_de_passe" exigé pour l'email et le mot de passe)
//  - administrateur sur un autre compte : "est_banni", "est_supprime" (restauration), "fk_role"
class ComptePutController extends AbstractController implements IController
{
    private CompteService $compteService;
    private int $pkCompte;
    private ?string $email = null;
    private ?string $pseudo = null;
    private ?string $motDePasse = null;
    private ?string $ancienMotDePasse = null;
    private ?bool $estBanni = null;
    private ?bool $estSupprime = null;
    private ?int $fkRole = null;

    public function __construct(array $form)
    {
        parent::__construct($form);
        $this->compteService = new CompteService();
    }

    protected function checkForm(): void
    {
        $this->requireParams("pk_compte");
        $this->requireOneOf("email", "pseudo", "mot_de_passe", "est_banni", "est_supprime", "fk_role");
    }

    protected function checkCybersec(): void
    {
        $this->pkCompte = $this->getId("pk_compte");

        if ($this->has("email")) {
            $this->email = $this->getString("email", 3, 100);
            if (!isEmail($this->email)) {
                throw new BadRequestException("Adresse email invalide.");
            }
        }
        if ($this->has("pseudo")) {
            $this->pseudo = $this->getString("pseudo", 3, 50);
            if (!isPseudo($this->pseudo)) {
                throw new BadRequestException("Le pseudo ne peut contenir que des lettres, des chiffres, des espaces et . _ -");
            }
        }
        if ($this->has("mot_de_passe")) {
            $this->motDePasse = $this->getPassword("mot_de_passe");
            if (!isPassword($this->motDePasse)) {
                throw new BadRequestException(
                    "Le mot de passe doit contenir de 12 à 72 caractères, dont une majuscule, une minuscule et un caractère spécial."
                );
            }
        }
        if ($this->has("ancien_mot_de_passe")) {
            $this->ancienMotDePasse = $this->getPassword("ancien_mot_de_passe");
        }
        if ($this->has("est_banni")) {
            $this->estBanni = $this->getBool("est_banni");
        }
        if ($this->has("est_supprime")) {
            $this->estSupprime = $this->getBool("est_supprime");
        }
        if ($this->has("fk_role")) {
            $this->fkRole = $this->getId("fk_role");
        }
    }

    protected function checkRights(): void
    {
        // Le détail (titulaire / administrateur) est vérifié par CompteService::update()
        AuthService::requireUser();
    }

    protected function processRequest(): void
    {
        // On part du compte actuel et on applique uniquement les champs envoyés
        $compte = $this->compteService->findByPk($this->pkCompte);
        if ($this->email !== null) {
            $compte->setEmail($this->email);
        }
        if ($this->pseudo !== null) {
            $compte->setPseudo($this->pseudo);
        }
        if ($this->estBanni !== null) {
            $compte->setEstBanni($this->estBanni);
        }
        if ($this->estSupprime !== null) {
            $compte->setEstSupprime($this->estSupprime);
        }
        if ($this->fkRole !== null) {
            $compte->setFkRole($this->fkRole);
        }

        $this->response = $this->compteService->update($compte, $this->motDePasse, $this->ancienMotDePasse);
    }
}
?>
