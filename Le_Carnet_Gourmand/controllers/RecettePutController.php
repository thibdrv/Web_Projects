<?php

require_once(ROOT . "/controllers/AbstractController.php");
require_once(ROOT . "/controllers/IController.php");
require_once(ROOT . "/controllers/RecettePostController.php");
require_once(ROOT . "/services/RecetteService.php");
require_once(ROOT . "/services/AuthService.php");
require_once(ROOT . "/exceptions/BadRequestException.php");

// PUT api.php?route=Recette, deux usages :
//  - modération (administrateur) : {"pk_recette", "est_approuve": true|false}
//  - modification partielle (auteur ou administrateur) :
//    {"pk_recette", "nom"?, "ingredients"?, "details"?, "image"?, "lien"?, "categories"?}
//    "categories" remplace toutes les catégories ; "image": "" ou "lien": null les efface.
class RecettePutController extends AbstractController implements IController
{
    private const CHAMPS = ["nom", "ingredients", "details", "image", "lien", "categories", "fk_categorie"];

    private RecetteService $service;
    private int $pkRecette;
    private ?bool $estApprouve = null;
    private ?string $nom = null;
    private ?string $ingredients = null;
    private ?string $details = null;
    private ?string $image = null;
    private ?string $lien = null;
    private bool $changeLien = false;
    private ?array $categories = null;

    public function __construct(array $form)
    {
        parent::__construct($form);
        $this->service = new RecetteService();
    }

    protected function checkForm(): void
    {
        $this->alias("pk_recette", "pk");
        $this->requireParams("pk_recette");

        $champs = array_filter(self::CHAMPS, fn(string $champ) => array_key_exists($champ, $this->form));
        if (array_key_exists("est_approuve", $this->form)) {
            if (!empty($champs)) {
                throw new BadRequestException("'est_approuve' s'envoie seul : la modération et la modification sont deux requêtes distinctes.");
            }
        } elseif (empty($champs)) {
            throw new BadRequestException("Aucun champ à modifier : " . implode(", ", self::CHAMPS) . " ou est_approuve.");
        }
    }

    protected function checkCybersec(): void
    {
        $this->pkRecette = $this->getId("pk_recette");

        if (array_key_exists("est_approuve", $this->form)) {
            $this->estApprouve = $this->getBool("est_approuve");
            return;
        }

        if ($this->has("nom")) {
            $this->nom = $this->getString("nom", 3, 100);
        }
        if ($this->has("ingredients")) {
            $this->ingredients = $this->getString("ingredients", 3, RecettePostController::TEXTE_MAX);
        }
        if ($this->has("details")) {
            $this->details = $this->getString("details", 5, RecettePostController::TEXTE_MAX);
        }
        if (array_key_exists("image", $this->form)) {
            $this->image = $this->has("image") ? $this->getString("image", 1, 255) : "";
            if ($this->image !== "" && !isImagePath($this->image)) {
                throw new BadRequestException("L'image doit être un fichier de public/image/ ou une URL http(s).");
            }
        }
        if (array_key_exists("lien", $this->form)) {
            $this->changeLien = true;
            $this->lien = $this->has("lien") ? $this->getString("lien", 1, 255) : null;
            if ($this->lien !== null && !isHttpUrl($this->lien)) {
                throw new BadRequestException("Le lien doit être une URL http(s).");
            }
        }
        if ($this->has("categories")) {
            $this->categories = $this->getIdList("categories");
        } elseif ($this->has("fk_categorie")) {
            $this->categories = $this->getIdList("fk_categorie");
        }
    }

    protected function checkRights(): void
    {
        if ($this->estApprouve !== null) {
            AuthService::requireAdmin();
        } else {
            AuthService::requireUser(); // auteur ou administrateur : vérifié par le service
        }
    }

    protected function processRequest(): void
    {
        if ($this->estApprouve !== null) {
            $this->response = $this->service->approve($this->pkRecette, $this->estApprouve);
            return;
        }

        // On part de la recette actuelle et on applique uniquement les champs envoyés
        $recette = $this->service->findByPk($this->pkRecette);
        if ($this->nom !== null) {
            $recette->setNom($this->nom);
        }
        if ($this->ingredients !== null) {
            $recette->setIngredients($this->ingredients);
        }
        if ($this->details !== null) {
            $recette->setDetails($this->details);
        }
        if ($this->image !== null) {
            $recette->setImage($this->image);
        }
        if ($this->changeLien) {
            $recette->setLien($this->lien);
        }

        $this->response = $this->service->update($recette, $this->categories);
    }
}
?>
