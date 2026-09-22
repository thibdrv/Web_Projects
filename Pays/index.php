<?php
require_once 'Pays.class.php';
require_once 'PaysRepository.class.php';
require_once 'PaysException.class.php';

$message = "";
$couleur = "";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $nom = isset($_POST['nom']) ? $_POST['nom'] : '';
    $population = isset($_POST['population']) ? $_POST['population'] : 0;

    try {
        $pays = new Pays($nom, floatval($population));
        $repo = new PaysRepository();
        $repo->inserer($pays);

        $message = "Pays " . htmlspecialchars($pays->getNom()) . " inséré";
        $couleur = "green";
    } catch (PaysException $e) {
        $message = $e->getMessage();
        $couleur = $e->getNiveau() === 'orange' ? 'orange' : 'red';
    } catch (Exception $e) {
        $message = "Erreur technique : " . $e->getMessage();
        $couleur = "red";
    }
}
?>

<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Ajout d'un pays</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <h1>Formulaire Pays</h1>

    <?php if ($message): ?>
        <div style="border: 1px solid <?= $couleur ?>; color: <?= $couleur ?>; padding: 10px; display: flex; justify-content: center;">
            <?= $message ?>
        </div>
    <?php endif; ?>

    <form method="post">
        <label>Nom du pays : <input type="text" name="nom" required></label><br><br>
        <label>Population (en millions) : <input type="number" name="population" step="0.01" required></label><br><br>
        <button type="submit">Ajouter</button>
    </form>
</body>
</html>