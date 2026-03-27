<?php
/**
 * CYVE CORS Handler
 * Must be included before any output or session logic.
 */

// 1. Load Environment Variables (Critical for production URLs)
$autoload_path = __DIR__ . '/../vendor/autoload.php';
if (file_exists($autoload_path)) {
    require_once $autoload_path;
}

// Check for .env file and load it safely
$dotenv_path = __DIR__ . '/../';
if (file_exists($dotenv_path . '.env')) {
    try {
        $dotenv = Dotenv\Dotenv::createImmutable($dotenv_path);
        $dotenv->safeLoad();
    } catch (\Throwable $e) {
        // Silently skip if Dotenv fails; Render environments already have variables in getenv()
    }
}

// 2. Identify Environment and Origin
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

// Check getenv() and $_ENV for production/Render support
$app_env = $_ENV['APP_ENV'] ?? getenv('APP_ENV') ?? 'development';
$is_prod = ($app_env === 'production');
$frontend_url = $_ENV['FRONTEND_URL'] ?? getenv('FRONTEND_URL') ?? '';

$allowed_origins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'http://127.0.0.1:3000',
    'https://cyve-frontend.onrender.com' // Explicit fallback for Render
];

if (!empty($frontend_url)) {
    $allowed_origins[] = rtrim($frontend_url, '/');
}

// 3. Set Access Control Origin
if (in_array($origin, $allowed_origins) || preg_match('/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/', $origin)) {
    header("Access-Control-Allow-Origin: $origin");
} elseif ($is_prod && !empty($frontend_url)) {
    header("Access-Control-Allow-Origin: " . rtrim($frontend_url, '/'));
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
