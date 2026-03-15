<?php
/**
 * CYVE Backend Core Configuration & Middleware
 * Handles environment loading, DB connection, CORS, and response utilities.
 */

// 0. Error reporting: always suppress display_errors so PHP errors never corrupt JSON output
$is_prod = (getenv('APP_ENV') === 'production');
error_reporting(E_ALL);
ini_set('display_errors', '0');  // Never output errors to response body
ini_set('log_errors', '1');
ini_set('error_log', __DIR__ . '/logs/php_errors.log');

// 1. Load Composer Autoloader (which includes Dotenv)
require_once __DIR__ . '/vendor/autoload.php';

// 2. Load Environment Variables via Dotenv
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

// 2. Database configuration from $_ENV
define('DB_HOST', $_ENV['DB_HOST'] ?? 'localhost');
define('DB_USER', $_ENV['DB_USER'] ?? 'root');
define('DB_PASS', $_ENV['DB_PASS'] ?? '');
define('DB_NAME', $_ENV['DB_NAME'] ?? 'cyve');

// 3. Create connection
$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

// 5. Check connection
if ($conn->connect_error) {
    header('Content-Type: application/json');
    die(json_encode([
        "success" => false, 
        "message" => "Database connection failed",
        "timestamp" => time(),
        "request_id" => uniqid('err_')
    ]));
}

/**
 * Sanitize input to prevent SQL Injection
 */
function sanitize($data)
{
    global $conn;
    return mysqli_real_escape_string($conn, trim($data));
}

/**
 * Log activity to the activity_logs database (Feature-02)
 */
function log_activity($user_id, $action_type, $description = '')
{
    global $conn;
    try {
        $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
        $stmt = $conn->prepare("
            INSERT INTO activity_logs (user_id, action_type, description, ip_address)
            VALUES (?, ?, ?, ?)
        ");
        // If prepare() fails (e.g. table missing), skip silently — never crash the caller
        if (!$stmt) return;
        $stmt->bind_param("isss", $user_id, $action_type, $description, $ip);
        $stmt->execute();
        $stmt->close();
    } catch (\Throwable $e) {
        // Log to file but never propagate — activity logging must never break core flows
        error_log('[CYVE] log_activity failed: ' . $e->getMessage());
    }
}
