<?php

define("ROOT", dirname(__FILE__)); // tous les require utilisent un chemin absolu

require_once(ROOT . "/utils/functions.php");
require_once(ROOT . "/utils/SessionManager.php");
require_once(ROOT . "/exceptions/HttpStatusException.php");

serverBootstrap(); // aucune erreur PHP affichée : la réponse reste du JSON valide

// Point d'entrée unique de l'API :
// api.php?route=Recette (GET) → controllers/RecetteGetController.php
// Succès : {"success": true, "data": ...}    Échec : {"success": false, "error": "..."}
try
{
    SessionManager::start();
    $FORM = extractForm();                 // query string + corps JSON (POST, PUT, DELETE)
    $CONTROLLER = createController($FORM); // <Route><Methode>Controller
    $response = $CONTROLLER->execute();
    sendJson($CONTROLLER->getStatusCode(), $response);
}
catch (HttpStatusException $ex)
{
    raiseHttpStatus($ex);
}
catch (PDOException $ex)
{
    raisePdoException($ex);
}
catch (Throwable $ex)
{
    error_log((string)$ex);
    sendJsonError(500, "Erreur interne du serveur.");
}
