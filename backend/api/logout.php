<?php
require_once 'middleware.php';

session_unset();
session_destroy();

// Expire persistent cookie if exists
if (isset($_COOKIE['cyve_remember'])) {
    setcookie('cyve_remember', '', time() - 3600, '/');
}

send_response(true, 'Logged out successfully');
?>
