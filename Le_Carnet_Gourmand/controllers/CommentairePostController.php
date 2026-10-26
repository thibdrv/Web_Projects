<?php

require_once(ROOT . "/controllers/AbstractController.php");
require_once(ROOT . "/controllers/IController.php");
require_once(ROOT . "/entities/Commentaire.php");
require_once(ROOT . "/services/CommentaireService.php");
require_once(ROOT . "/services/AuthService.php");

// POST api.php?route=Commentaire {"fk_recette", "contenu"} : un commentaire par compte et par recette,
// publié après validation par un administrateur
class CommentairePostController extends AbstractController implements IController
{
    public const CONTENU_MAX = 2000;

    private CommentaireService $service;
    private int $fkRecette;
    private string $contenu;

    public function __construct(array $form)
    {
        parent::__construct($form);
        $this->service = new CommentaireService();
    }

    protected function checkForm(): void
    {
        $this->requireParams("fk_recette", "contenu");
    }

    protected function checkCybersec(): void
    {
        $this->fkRecette = $this->getId("fk_recette");
        // Texte enregistré tel quel : c'est à l'affichage qu'il doit être échappé
        $this->contenu = $this->getString("contenu", 2, self::CONTENU_MAX);
    }

    protected function checkRights(): void
    {
        AuthService::requireUser();
    }

    protected function processRequest(): void
    {
        $commentaire = Commentaire::create($this->fkRecette, $this->contenu);
        $this->service->insert($commentaire);

        $this->statusCode = 201;
        $this->response = $this->service->findByPk($commentaire->getPk());
    }
}
?>
