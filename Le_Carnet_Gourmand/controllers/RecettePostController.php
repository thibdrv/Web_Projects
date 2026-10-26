<?php

require_once(ROOT . "/controllers/AbstractController.php");
require_once(ROOT . "/controllers/IController.php");
require_once(ROOT . "/entities/Recette.php");
require_once(ROOT . "/services/RecetteService.php");
require_once(ROOT . "/services/AuthService.php");
require_once(ROOT . "/exceptions/BadRequestException.php");

// POST api.php?route=Recette
// {"nom", "ingredients", "details", "categories": [1, 2] (ou "fk_categorie": 1), "image"?, "lien"?}
// La recette est créée en attente de validation par un administrateur.
class RecettePostController extends AbstractController implements IController
{
    // TEXT = 65 535 octets, soit au moins 16 383 caractères en utf8mb4
    public const TEXTE_MAX = 15000;

    private RecetteService $service;
    private string $nom;
    private string $ingredients;
    private string $details;
    private array $categories = [];
    private string $image = "";
    private ?string $lien = null;

    public function __construct(array $form)
    {
        parent::__construct($form);
        $this->service = new RecetteService();
    }

    protected function checkForm(): void
    {
        $this->requireParams("nom", "ingredients", "details");
        $this->requireOneOf("categories", "fk_categorie");
    }

    protected function checkCybersec(): void
    {
        // Les textes sont enregistrés tels quels (requêtes préparées) : c'est à l'affichage qu'ils sont échappés
        $this->nom = $this->getString("nom", 3, 100);
        $this->ingredients = $this->getString("ingredients", 3, self::TEXTE_MAX);
        $this->details = $this->getString("details", 5, self::TEXTE_MAX);

        if ($this->has("categories")) {
            $this->categories = $this->getIdList("categories");
        }
        if ($this->has("fk_categorie")) {
            $this->categories = array_values(array_unique(array_merge($this->categories, $this->getIdList("fk_categorie"))));
        }

        if ($this->has("image")) {
            $this->image = $this->getString("image", 1, 255);
            if (!isImagePath($this->image)) {
                throw new BadRequestException("L'image doit être un fichier de public/image/ ou une URL http(s).");
            }
        }
        if ($this->has("lien")) {
            $this->lien = $this->getString("lien", 1, 255);
            if (!isHttpUrl($this->lien)) {
                throw new BadRequestException("Le lien doit être une URL http(s).");
            }
        }
    }

    protected function checkRights(): void
    {
        AuthService::requireUser();
    }

    protected function processRequest(): void
    {
        $recette = Recette::create($this->nom, $this->ingredients, $this->details, $this->image, $this->lien);
        $pkRecette = $this->service->insert($recette, $this->categories);

        $this->statusCode = 201;
        $this->response = $this->service->findByPk($pkRecette);
    }
}
?>
