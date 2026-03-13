<?php
require_once 'middleware.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['email'])) {
    send_response(false, 'Email is required', [], 400);
}

$email = trim($data['email']);

use CYVE\Repositories\UserRepository;
$userRepo = new UserRepository($conn);

$user = $userRepo->findByEmail($email);

if ($user) {
    $token = bin2hex(random_bytes(32));
    $expiry = date('Y-m-d H:i:s', time() + 3600); // 1 hour expiry

    if ($userRepo->createPasswordReset($user['id'], $token, $expiry)) {
        // SIMULATION: Log the reset link to a file instead of sending email
        $resetLink = "http://localhost:3000/reset-password?token=" . $token;
        file_put_contents(__DIR__ . '/../../logs/password_resets.log',
            date('[Y-m-d H:i:s]') . " Reset link for $email: $resetLink\n",
            FILE_APPEND);

        send_response(true, 'If an account exists with that email, a reset link has been sent.');
    }
    else {
        send_response(false, 'Error processing request', [], 500);
    }
}
else {
    // For security, don't reveal if email exists
    send_response(true, 'If an account exists with that email, a reset link has been sent.');
}
?>
