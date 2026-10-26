<?php

interface IController
{
    // Exécute la requête et renvoie le corps JSON de la réponse
    public function execute(): string;

    // Statut HTTP de la réponse en cas de succès (200, 201...)
    public function getStatusCode(): int;
}

?>
