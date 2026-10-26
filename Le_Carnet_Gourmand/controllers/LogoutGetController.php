<?php

require_once(ROOT . "/controllers/AbstractController.php");
require_once(ROOT . "/controllers/IController.php");
require_once(ROOT . "/services/AuthService.php");

// GET api.php?route=Logout : ferme la session (sans erreur si elle l'était déjà)
class LogoutGetController extends AbstractController implements IController
{
    protected function checkForm(): void {}

    protected function checkCybersec(): void {}

    protected function checkRights(): void {}

    protected function processRequest(): void
    {
        AuthService::logout();
        $this->response = ["est_connecte" => false];
    }
}
?>
