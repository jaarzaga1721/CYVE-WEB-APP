<?php
// STEP 1: CORS always comes first — before everything
require_once __DIR__ . '/cors.php';

require_once 'middleware.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['token']) || !isset($data['password'])) {
    send_response(false, 'Token and new password are required', [], 400);
}

$token = $data['token'];
$passwordRaw = $data['password'];

if (strlen($passwordRaw) < 8) {
    send_response(false, 'Password must be at least 8 characters', [], 400);
}

use CYVE\Repositories\UserRepository;
$userRepo = new UserRepository($conn);

$user = $userRepo->findByValidResetToken($token);

if ($user) {
    $passwordHash = password_hash($passwordRaw, PASSWORD_BCRYPT);

    if ($userRepo->resetPassword($user['id'], $passwordHash)) {
        send_response(true, 'Password has been reset successfully. You can now login.');
    }
    else {
        send_response(false, 'Error updating password', [], 500);
    }
}
else {
    send_response(false, 'Invalid or expired token', [], 400);
}
?>
