<?php
ob_start(); // Buffer any stray output to prevent JSON corruption
header("Content-Type: application/json");
require_once 'middleware.php';

use CYVE\Repositories\UserRepository;

$raw = file_get_contents("php://input");
$data = json_decode($raw, true);

// Guard: body missing, empty, or not valid JSON
if (!is_array($data) || !isset($data['email']) || !isset($data['password'])) {
    ob_end_clean();
    send_response(false, 'Missing required fields');
}

$identity = sanitize($data['email']);
$password = $data['password'];

$userRepo = new UserRepository($conn);
$user = $userRepo->findByIdentity($identity);

if ($user) {
    if (password_verify($password, $user['password'])) {
        log_activity($user['id'], 'login', 'User logged in via API');
        
        // Session fixation protection
        session_regenerate_id(true);
        
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['email'] = $user['email'];
        $_SESSION['role'] = $user['role'];
        $_SESSION['username'] = $user['username'];

        ob_end_clean();
        send_response(true, 'Access granted. Welcome to CYVE HQ.', [
            'user' => [
                'id' => $user['id'],
                'username' => $user['username'],
                'display_name' => $user['display_name'],
                'email' => $user['email'],
                'name' => $user['display_name'] ? $user['display_name'] : strtoupper($user['username']),
                'role' => $user['role'],
                'csrf_token' => $_SESSION['csrf_token'] ?? ''
            ]
        ]);
    }
    else {
        ob_end_clean();
        send_response(false, 'Invalid credentials. Please verify your password.', [], 401);
    }
}
else {
    ob_end_clean();
    send_response(false, 'Identity not recognized. No such agent in database.', [], 404);
}
