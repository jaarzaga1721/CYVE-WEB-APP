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
    'http://localhost:3002',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001',
    'http://127.0.0.1:3002',
    $_ENV['FRONTEND_URL'] ?? null,  // e.g. https://cyve.ph
]);

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowed_origins, true)) {
    header("Access-Control-Allow-Origin: $origin");
} elseif (!$is_production) {
    // In development, allow any localhost or 127.0.0.1 origin
    if (preg_match('/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/', $origin)) {
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

// ─── CSRF Protection ─────────────────────────────────────────────────────────
if (empty($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}

function verify_csrf_token($token) {
    if (empty($_SESSION['csrf_token']) || !hash_equals($_SESSION['csrf_token'], $token)) {
        header('Content-Type: application/json');
        die(json_encode(['success' => false, 'message' => 'Invalid CSRF token']));
    }
}

// ─── Admin Check (Feature-01) ────────────────────────────────────────────────
function require_admin() {
    if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'admin') {
        header('Content-Type: application/json');
        http_response_code(403);
        die(json_encode(['success' => false, 'message' => 'Forbidden: Admin clearance required.']));
    }
}

function log_admin_activity($admin_id, $action, $target_user = null) {
    global $conn;
    try {
        $stmt = $conn->prepare("INSERT INTO admin_logs (admin_id, action, target_user) VALUES (?, ?, ?)");
        if (!$stmt) return;
        $stmt->bind_param("isi", $admin_id, $action, $target_user);
        $stmt->execute();
        $stmt->close();
    } catch (\Throwable $e) {
        error_log('[CYVE] log_admin_activity failed: ' . $e->getMessage());
    }
}
