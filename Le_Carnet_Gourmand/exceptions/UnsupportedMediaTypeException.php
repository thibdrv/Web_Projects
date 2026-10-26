<?php

require_once(ROOT . "/exceptions/HttpStatusException.php");

// 415 : le corps de la requête n'est pas envoyé en application/json.
class UnsupportedMediaTypeException extends HttpStatusException
{
    public function __construct(string $message = "Le Content-Type doit être application/json.", ?Throwable $previous = null)
    {
        parent::__construct($message, 415, $previous);
    }
}
?>
