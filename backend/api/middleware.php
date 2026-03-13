<?php
/**
 * CYVE API Middleware
 * Handles CORS, Security Headers, and Secure Sessions.
 */

require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/response.php';

$is_production = (($_ENV['APP_ENV'] ?? 'development') === 'production');

// ─── CORS Allowlist ──────────────────────────────────────────────────────────
$allowed_origins = array_filter([
    'http://localhost:3000',
    'http://localhost:3001',
    $_ENV['FRONTEND_URL'] ?? null,  // e.g. https://cyve.ph
]);

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowed_origins, true)) {
    header("Access-Control-Allow-Origin: $origin");
} elseif (!$is_production) {
    // In development, allow any localhost origin
    if (preg_match('/^https?:\/\/localhost(:\d+)?$/', $origin)) {
        header("Access-Control-Allow-Origin: $origin");
    }
}
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

// ─── Security Headers ─────────────────────────────────────────────────────────
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('Referrer-Policy: strict-origin-when-cross-origin');
header('Permissions-Policy: camera=(), microphone=(), geolocation=()');
if ($is_production) {
    header('Strict-Transport-Security: max-age=31536000; includeSubDomains; preload');
}

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

// ─── Secure Session Configuration (30 Days TTL) ──────────────────────────────
$session_lifetime = 2592000;
ini_set('session.gc_maxlifetime', $session_lifetime);
ini_set('session.use_only_cookies', 1);
session_set_cookie_params([
    'lifetime' => $session_lifetime,
    'path' => '/',
    'domain' => '',
    'secure' => $is_production,
    'httponly' => true,
    'samesite' => $is_production ? 'Strict' : 'Lax',
]);

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
?>
