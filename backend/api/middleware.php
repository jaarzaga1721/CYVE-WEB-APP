<?php
/**
 * CYVE API Middleware
 * Handles CORS, Security Headers, and Secure Sessions.
 */

require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/response.php';

$is_production = (($_ENV['APP_ENV'] ?? 'development') === 'production');

// ─── CORS & Headers (Fix 1) ────────────────────────────────────────────────
$origin = $_SERVER['HTTP_ORIGIN'] ?? 'http://localhost:3000';
$allowed_origins = ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'http://127.0.0.1:3000', 'http://127.0.0.1:3001', 'http://127.0.0.1:3002'];

if (in_array($origin, $allowed_origins)) {
    header("Access-Control-Allow-Origin: $origin");
} else {
    header("Access-Control-Allow-Origin: http://localhost:3000");
}

header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

// ─── Secure Session Configuration (30 Days TTL) ──────────────────────────────
ini_set('session.cookie_samesite', 'None');
ini_set('session.cookie_secure', '0');
ini_set('session.cookie_httponly', '1');
ini_set('session.gc_maxlifetime', 2592000);

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
