<?php
header("Content-Type: application/json");
require_once 'middleware.php';

use CYVE\Repositories\UserRepository;

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['email']) || !isset($data['password'])) {
    send_response(false, 'Missing required fields');
}

$identity = sanitize($data['email']);
$password = $data['password'];

$userRepo = new UserRepository($conn);
$user = $userRepo->findByIdentity($identity);

if ($user) {
    if (password_verify($password, $user['password'])) {
        log_activity($user['id'], 'login', 'User logged in via API');
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['email'] = $user['email'];
        $_SESSION['role'] = $user['role'];
        $_SESSION['username'] = $user['username'];

        send_response(true, 'Access granted. Welcome to CYVE HQ.', [
            'user' => [
                'id' => $user['id'],
                'username' => $user['username'],
                'display_name' => $user['display_name'],
                'email' => $user['email'],
                'name' => $user['display_name'] ? $user['display_name'] : strtoupper($user['username']),
                'role' => $user['role']
            ]
        ]);
    }
    else {
        log_activity($user['id'], 'failed_login', 'Invalid password attempt via API');
        send_response(false, 'Invalid credentials. Please verify your password.', [], 401);
    }
}
else {
    send_response(false, 'Identity not recognized. No such agent in database.', [], 404);
}
?>
