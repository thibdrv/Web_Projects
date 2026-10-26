<?php

require_once(ROOT . "/exceptions/HttpStatusException.php");

// 400 : paramètre absent, mal formé ou invalide.
class BadRequestException extends HttpStatusException
{
    public function __construct(string $message = "Requête invalide", ?Throwable $previous = null)
    {
        parent::__construct($message, 400, $previous);
    }
}
?>
