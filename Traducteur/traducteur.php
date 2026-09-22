<?php

$result = null;
$direction = "toFrench";
$word = "";
if(array_key_exists("direction", $_POST) == true)
{
    $direction = $_POST['direction'];
}
if(array_key_exists("word", $_POST) == true)
{
    $word = strtolower($_POST['word']);
	include '00-traducteur.inc.php';
    $result = translate($word, $direction);
}

include '00-traducteur.phtml';