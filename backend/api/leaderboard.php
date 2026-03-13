<?php
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
