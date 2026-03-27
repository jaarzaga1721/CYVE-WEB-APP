<?php
/**
 * CYVE API Middleware
 * Handles CORS, Security Headers, and Secure Sessions.
 */

require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/response.php';

$is_production = (($_ENV['APP_ENV'] ?? 'development') === 'production');

// CORS & Session: handled by cors.php — must be included before this file.
// If session not yet started (e.g. when middleware is included directly), start it.
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
