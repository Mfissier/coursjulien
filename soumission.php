<?php
// Connexion à la base de données
// Remplacez 'mysql:host=localhost;dbname=your_database', 'username', 'password' par vos propres informations de connexion
$pdo = new PDO('mysql:host=localhost;dbname=your_database', 'username', 'password');

// Préparation de la réponse
$response = ['success' => true, 'errors' => []];

// Récupération des données du formulaire
$pseudo = isset($_POST['pseudo']) ? trim($_POST['pseudo']) : '';
$email = isset($_POST['email']) ? trim($_POST['email']) : '';
$telephone = isset($_POST['telephone']) ? trim($_POST['telephone']) : '';

// Vérification du pseudo
if (!empty($pseudo)) {
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM users WHERE pseudo = ?");
    $stmt->execute([$pseudo]);
    if ($stmt->fetchColumn() > 0) {
        $response['success'] = false;
        $response['errors']['pseudo'] = "Pseudo déjà pris, veuillez en choisir un autre.";
    }
}

// Vérification de l'email
if (!empty($email)) {
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM users WHERE email = ?");
    $stmt->execute([$email]);
    if ($stmt->fetchColumn() > 0) {
        $response['success'] = false;
        $response['errors']['email'] = "Mail déjà pris, veuillez en choisir un autre.";
    }
}

// Vérification du téléphone
if (!empty($telephone)) {
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM users WHERE telephone = ?");
    $stmt->execute([$telephone]);
    if ($stmt->fetchColumn() > 0) {
        $response['success'] = false;
        $response['errors']['telephone'] = "Numéro de téléphone déjà utilisé.";
    }
}

// Vérification des autres champs comme exemple
// Par exemple, vérification du nom
$name = isset($_POST['name']) ? trim($_POST['name']) : '';
if (!empty($name)) {
    // Effectuez ici des vérifications supplémentaires si nécessaire
}

// Vérification des autres champs comme exemple
// Par exemple, vérification du prénom
$prename = isset($_POST['prename']) ? trim($_POST['prename']) : '';
if (!empty($prename)) {
    // Effectuez ici des vérifications supplémentaires si nécessaire
}

// Envoi de la réponse
header('Content-Type: application/json');
echo json_encode($response);
