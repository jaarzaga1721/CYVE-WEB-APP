<?php
// STEP 1: CORS always comes first — before everything
require_once __DIR__ . '/cors.php';

// STEP 2: Auth check comes AFTER cors (this fixes the 401 errors)
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['error' => 'Unauthorized', 'code' => 401]);
    http_response_code(401);
    exit();
}

require_once 'middleware.php';
header("Content-Type: application/json");

// Public endpoint - no session check required for viewing the leaderboard
// though we usually might want one, let's keep it open for now or restrict it if needed.

use CYVE\Repositories\UserRepository;

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $userRepo = new UserRepository($conn);
    $top_leaderboard = $userRepo->getLeaderboard();

    send_response(true, 'Leaderboard data decrypted.', ['leaderboard' => $top_leaderboard]);
} else {
    send_response(false, 'Method not allowed.', [], 405);
}
?>
