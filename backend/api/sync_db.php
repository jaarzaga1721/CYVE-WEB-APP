<?php
/**
 * CYVE Comprehensive Database Sync
 * Synchronizes schema across cyve.sql, network_migration.sql, and network_privacy_update.sql
 */

$configPath = __DIR__ . '/../config.php';
if (!file_exists($configPath)) {
    die("Error: Config file not found at $configPath\n");
}

require_once $configPath;

$sqlFiles = [
    __DIR__ . '/../../database/cyve.sql',
    __DIR__ . '/../../database/network_migration.sql',
    __DIR__ . '/../../database/network_privacy_update.sql'
];

echo "--- CYVE Database Synchronization ---\n";

foreach ($sqlFiles as $file) {
    if (!file_exists($file)) {
        echo "[WARNING] SQL file missing: $file\n";
        continue;
    }

    echo "[INFO] Applying: " . basename($file) . "...\n";
    $sql = file_get_contents($file);

    if ($conn->multi_query($sql)) {
        do {
            if ($result = $conn->store_result()) {
                $result->free();
            }
        } while ($conn->more_results() && $conn->next_result());
        echo "[SUCCESS] Applied " . basename($file) . "\n";
    } else {
        echo "[ERROR] Failed to apply " . basename($file) . ": " . $conn->error . "\n";
    }
}

echo "Finalizing synchronization...\n";

// Ensure signal_feed table has the needed columns if not present
// (Checking if any specific fixes are needed post-migration)

$tablesResult = $conn->query("SHOW TABLES");
$tables = [];
while ($row = $tablesResult->fetch_array()) {
    $tables[] = $row[0];
}

echo "Active Tables: " . implode(", ", $tables) . "\n";
echo "Synchronization complete.\n";

$conn->close();
?>
