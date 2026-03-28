<?php
// STEP 1: CORS always comes first — before everything
require_once __DIR__ . '/cors.php';

require_once 'middleware.php';

session_start();
if (isset($_SESSION['user_id'])) {
    \log_activity($_SESSION['user_id'], 'logout', 'User session terminated');
}
session_unset();
session_destroy();

// Expire persistent cookies
if (isset($_COOKIE['PHPSESSID'])) {
    setcookie('PHPSESSID', '', time() - 3600, '/', '', false, true);
}
if (isset($_COOKIE['cyve_remember'])) {
    setcookie('cyve_remember', '', time() - 3600, '/');
}

send_response(true, 'Logged out successfully');
?>
