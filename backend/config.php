<?php
/**
 * CYVE Backend Core Configuration & Middleware
 * Handles environment loading, DB connection, CORS, and response utilities.
 */

// 0. Error reporting: suppress for production, show for dev
$is_prod = (getenv('APP_ENV') === 'production');
if ($is_prod) {
    error_reporting(0);
    ini_set('display_errors', '0');
    ini_set('log_errors', '1');
    ini_set('error_log', __DIR__ . '/logs/php_errors.log');
} else {
    error_reporting(E_ALL);
    ini_set('display_errors', '1');
}

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
 * Log activity to the audit database
 */
function log_activity($user_id, $action, $details = '')
{
    global $conn;
    $stmt = $conn->prepare("INSERT INTO audit_log (user_id, action, details) VALUES (?, ?, ?)");
    $stmt->bind_param("iss", $user_id, $action, $details);
    $stmt->execute();
    $stmt->close();
}
?>
