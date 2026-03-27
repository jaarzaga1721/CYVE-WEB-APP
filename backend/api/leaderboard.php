<?php
// STEP 1: CORS always comes first — before everything
require_once __DIR__ . '/cors.php';

// STEP 2: Core configuration and common logic
require_once 'middleware.php';

// STEP 3: Ensure session integrity
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Optional: Auth check if you want it protected, or keep public.
// Currently keeping it open for the "Labs" and "Homepage" viewers.

use CYVE\Repositories\UserRepository;

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $userRepo = new UserRepository($conn);
    $top_leaderboard = $userRepo->getLeaderboard();

    send_response(true, 'Leaderboard data decrypted.', ['leaderboard' => $top_leaderboard]);
} else {
    send_response(false, 'Method not allowed.', [], 405);
}
?>
