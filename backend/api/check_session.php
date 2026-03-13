<?php
require_once 'middleware.php';
header("Content-Type: application/json");

use CYVE\Repositories\UserRepository;

if (isset($_SESSION['user_id'])) {
    $userRepo = new UserRepository($conn);
    $user = $userRepo->findById($_SESSION['user_id']);

    if ($user) {
        send_response(true, 'Session active', [
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
}
send_response(false, 'Not logged in');
?>
