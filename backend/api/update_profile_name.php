<?php
header("Content-Type: application/json");
require_once 'middleware.php';

if (!isset($_SESSION['user_id'])) {
    send_response(false, 'Unauthorized', [], 401);
}

$user_id = $_SESSION['user_id'];
$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['display_name'])) {
    send_response(false, 'Missing designation', [], 400);
}

$displayName = sanitize($data['display_name']);

use CYVE\Repositories\UserRepository;
$userRepo = new UserRepository($conn);

if ($userRepo->updateDisplayName($user_id, $displayName)) {
    send_response(true, 'Identity established.');
} else {
    send_response(false, 'Failed to update identity.', [], 500);
}
?>
