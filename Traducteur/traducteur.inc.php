<?php

// Partie métier ou modèle = le but de l'application
function translate($word, $direction)
{
    // Le dictionnaire du traducteur.
    $dictionary =
    [
        'cat'    => 'chat',
        'dog'    => 'chien',
        'monkey' => 'singe',
        'sea'    => 'mer',
        'sun'    => 'soleil',
		'tiger'  => 'tigre',
    ];


    // Traduction du mot en -> fr ou fr -> en.
    switch($direction)
    {
        case 'toFrench':
        /*
         * Le mot spécifié est en anglais, on veut traduire vers le français.
         *
         * Il s'agit donc d'un indice dans le dictionnaire.
         * Est-ce que ce mot existe en tant qu'indice dans le dictionnaire ?
         */
        if(array_key_exists($word, $dictionary) == true)
        {
            // Oui, récupération de la valeur, de la traduction en français.
            $translatedWord = $dictionary[$word];

            $message = "Le mot '$word' se traduit par '$translatedWord'.";
        }
        else
        {
            // Non, cet indice n'existe pas.
            $message = "Je ne connais pas le mot '$word'.";
        }
        break;

        case 'toEnglish':
        /*
         * Le mot spécifié est en français, on veut traduire vers l'anglais.
         *
         * Il s'agit donc d'une valeur dans le dictionnaire.
         * Est-ce que ce mot existe en tant que valeur dans le dictionnaire ?
         */
        if(in_array($word, $dictionary) == true)
        {
            // Oui, récupération de l'indice, de la traduction en anglais.
            $translatedWord = array_search($word, $dictionary);

            $message = "Le mot '$word' se traduit par '$translatedWord'.";
        }
        else
        {
            // Non, cette valeur n'existe pas.
            $message = "Je ne connais pas le mot '$word'.";
        }
        break;

        default:
        $message = "Je ne sais traduire qu'en français et en anglais !";
    }
	
    return $message;
}
