<?php
header("Content-Type: application/json");
require_once 'middleware.php';
require_once 'network/utils.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['name']) || !isset($data['email']) || !isset($data['password'])) {
    send_response(false, 'Missing required fields', [], 400);
}

$fullName = trim($data['name']);
$email = trim($data['email']);
$passwordRaw = $data['password'];

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    send_response(false, 'Invalid email format', [], 400);
}

if (strlen($passwordRaw) < 8) {
    send_response(false, 'Password must be at least 8 characters', [], 400);
}

$username = strtolower(preg_replace('/[^A-Za-z0-9]/', '', strstr($email, '@', true)));
if (empty($username)) {
    $username = strtolower(preg_replace('/[^A-Za-z0-9]/', '', $fullName));
}

$passwordHash = password_hash($passwordRaw, PASSWORD_BCRYPT);

use CYVE\Repositories\UserRepository;

$userRepo = new UserRepository($conn);

if ($userRepo->exists($email, $username)) {
    send_response(false, 'Email or username already exists', [], 409);
}

$insertId = $userRepo->create($username, $email, $passwordHash, $fullName);

if ($insertId) {
    log_activity($insertId, 'signup', 'New operative registered');
    
    // Session fixation protection
    session_regenerate_id(true);
    
    $_SESSION['user_id'] = $insertId;
    $_SESSION['email'] = $email;
    $_SESSION['role'] = 'operative';
    $_SESSION['username'] = $username;

    send_response(true, 'Registration successful', [
        'user' => [
            'id' => $insertId,
            'username' => $username,
            'display_name' => null,
            'email' => $email,
            'name' => $fullName,
            'role' => 'operative',
            'csrf_token' => $_SESSION['csrf_token']
        ]
    ], 201);
}
else {
    send_response(false, 'Registration failed', [], 500);
}
?>
