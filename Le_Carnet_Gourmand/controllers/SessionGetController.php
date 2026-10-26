<?php

require_once(ROOT . "/controllers/AbstractController.php");
require_once(ROOT . "/controllers/IController.php");
require_once(ROOT . "/services/AuthService.php");
require_once(ROOT . "/utils/SessionManager.php");

// GET api.php?route=Session : état de la session (public)
class SessionGetController extends AbstractController implements IController
{
    protected function checkForm(): void {}

    protected function checkCybersec(): void {}

    protected function checkRights(): void {}

    protected function processRequest(): void
    {
        $compte = AuthService::currentUser();
        $this->response = [
            "est_connecte" => $compte !== null,
            "expiration" => $compte !== null ? SessionManager::getExpirationTime() : null,
            "compte" => $compte,
        ];
    }
}
?>
