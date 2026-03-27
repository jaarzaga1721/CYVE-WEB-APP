<?php
/**
 * DB Debug Endpoint
 * Verifies database connection and returns system status.
 */

// Include core configuration (handles environment loading and $conn creation)
require_once __DIR__ . '/../config.php';

// Set response header
header('Content-Type: application/json');

$response = [
    "success" => false,
    "status" => "initializing",
    "environment" => getenv('APP_ENV') ?: 'development',
    "details" => [
        "host" => defined('DB_HOST') ? DB_HOST : 'undefined',
        "database" => defined('DB_NAME') ? DB_NAME : 'undefined',
        "port" => isset($db_port) ? $db_port : 3306,
        "ssl" => (getenv('MYSQL_SSL') === 'true') ? "enabled" : "disabled"
    ],
    "timestamp" => date('Y-m-d H:i:s')
];

// Check $conn status (created in config.php)
if (!isset($conn) || $conn->connect_error) {
    $response["status"] = "offline";
    $response["error"] = isset($conn) ? $conn->connect_error : "Connection object not found";
} else {
    // Test connectivity with a simple query
    try {
        $result = $conn->query("SHOW TABLES");
        if ($result) {
            $tables = [];
            while ($row = $result->fetch_row()) {
                $tables[] = $row[0];
            }
            $response["success"] = true;
            $response["status"] = "online";
            $response["details"]["tables"] = $tables;
            $response["details"]["tables_count"] = count($tables);
        } else {
            $response["error"] = "Query failed: " . $conn->error;
        }
    } catch (Exception $e) {
        $response["error"] = "Exception: " . $e->getMessage();
    }
}

echo json_encode($response, JSON_PRETTY_PRINT);
?>