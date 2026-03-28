<?php
/**
 * CYVE Backend Core Configuration & Middleware
 * Handles environment loading, DB connection, CORS, and response utilities.
 */

// 0. Error reporting: always suppress display_errors so PHP errors never corrupt JSON output
$is_prod = (getenv('APP_ENV') === 'production');
error_reporting(E_ALL);
ini_set('display_errors', '0'); // Never output errors to response body
ini_set('log_errors', '1');

// Ensure the backend logs directory exists so errors can be recorded.
$logDirectory = __DIR__ . '/logs';
if (!is_dir($logDirectory)) {
    @mkdir($logDirectory, 0755, true);
}
ini_set('error_log', $logDirectory . '/php_errors.log');

// 1. Load Composer Autoloader (which includes Dotenv)
require_once __DIR__ . '/vendor/autoload.php';

// 2. Load Environment Variables via Dotenv
// Use safeLoad() to prevent a fatal crash if .env is missing (dashboard ENV will still work)
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->safeLoad();

if (file_exists('/etc/secrets/.env')) {
    $lines = @file('/etc/secrets/.env', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    if ($lines) {
        foreach ($lines as $line) {
            if (strpos(trim($line), '#') === 0)
                continue;
            if (strpos($line, '=') !== false) {
                list($key, $value) = explode('=', $line, 2);
                $key = trim($key);
                $value = trim($value);
                if (!empty($key)) {
                    putenv("$key=$value");
                    $_ENV[$key] = $value;
                    $_SERVER[$key] = $value;
                }
            }
        }
    }
}

// 2. Database configuration
define('DB_HOST', ($_ENV['DB_HOST'] ?? getenv('DB_HOST')) ?: '127.0.0.1');
define('DB_USER', ($_ENV['DB_USER'] ?? getenv('DB_USER')) ?: 'root');
define('DB_PASS', ($_ENV['DB_PASS'] ?? getenv('DB_PASS')) ?: '');
define('DB_NAME', ($_ENV['DB_NAME'] ?? getenv('DB_NAME')) ?: 'cyve');

// 3. Create connection
$db_port = intval((($_ENV['DB_PORT'] ?? getenv('DB_PORT')) ?: 3306));
$mysql_ssl = ($_ENV['MYSQL_SSL'] ?? getenv('MYSQL_SSL')) ?: 'false';

try {
    $conn = new mysqli();

    if ($mysql_ssl === 'true') {
        $conn->ssl_set(NULL, NULL, NULL, NULL, NULL);
        $conn->real_connect(DB_HOST, DB_USER, DB_PASS, DB_NAME, $db_port, NULL, MYSQLI_CLIENT_SSL);
    }
    else {
        $conn->real_connect(DB_HOST, DB_USER, DB_PASS, DB_NAME, $db_port);
    }
}
catch (Throwable $e) {
    // If connection fails, log it and return JSON error if not handled by caller
    error_log('[CYVE] Database connection failed: ' . $e->getMessage());

    if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
        http_response_code(200);
        exit(0);
    }

    // Note: CORS headers are already set by cors.php
    if (!headers_sent()) {
        header('Content-Type: application/json');
    }

    die(json_encode([
        "success" => false,
        "message" => "Neural-link database offline. Verify backend status.",
        "timestamp" => time()
    ]));
}

// 5. Check connection
if ($conn->connect_error) {
    error_log('[CYVE] Database connect error: ' . $conn->connect_error);
    if (!headers_sent()) {
        header('Content-Type: application/json');
    }
    die(json_encode([
        "success" => false,
        "message" => "Database handshake failed.",
        "timestamp" => time()
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
        if (!$stmt)
            return;
        $stmt->bind_param("isss", $user_id, $action_type, $description, $ip);
        $stmt->execute();
        $stmt->close();
    }
    catch (\Throwable $e) {
        // Log to file but never propagate — activity logging must never break core flows
        error_log('[CYVE] log_activity failed: ' . $e->getMessage());
    }
}