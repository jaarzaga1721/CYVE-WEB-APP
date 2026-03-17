<?php
header("Content-Type: application/json");
// STEP 1: CORS always comes first — before everything
require_once __DIR__ . '/cors.php';

// STEP 2: Auth check comes AFTER cors (this fixes the 401 errors)
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['error' => 'Unauthorized', 'code' => 401]);
    http_response_code(401);
    exit();
}

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
