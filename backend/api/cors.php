<?php
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$is_prod = (($_ENV['APP_ENV'] ?? $_SERVER['APP_ENV'] ?? '') === 'production');
$frontend_url = $_ENV['FRONTEND_URL'] ?? $_SERVER['FRONTEND_URL'] ?? '';

$allowed_origins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'http://127.0.0.1:3000',
    $frontend_url
];

if (in_array($origin, $allowed_origins) || preg_match('/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/', $origin)) {
    header("Access-Control-Allow-Origin: $origin");
} elseif ($is_prod && $frontend_url) {
    header("Access-Control-Allow-Origin: " . $frontend_url);
}

header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

ini_set('session.cookie_samesite', $is_prod ? 'None' : 'Lax');
ini_set('session.cookie_secure', $is_prod ? '1' : '0');
ini_set('session.cookie_httponly', '1');
ini_set('session.gc_maxlifetime', 2592000);
session_start();
