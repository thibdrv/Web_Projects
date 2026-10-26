<?php

// Exception de base de l'API : son code est le statut HTTP renvoyé au client
// et son message devient le champ "error" de la réponse JSON (voir api.php).
class HttpStatusException extends Exception
{
    public function __construct(string $message, int $code = 500, ?Throwable $previous = null)
    {
        parent::__construct($message, $code, $previous);
    }
}

?>
