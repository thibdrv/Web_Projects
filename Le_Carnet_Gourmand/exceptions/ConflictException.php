<?php

require_once(ROOT . "/exceptions/HttpStatusException.php");

// 409 : l'action entre en conflit avec l'état des données (doublon, ressource liée...).
class ConflictException extends HttpStatusException
{
    public function __construct(string $message = "Conflit avec l'état actuel des données.", ?Throwable $previous = null)
    {
        parent::__construct($message, 409, $previous);
    }
}
?>
