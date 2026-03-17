<?php
// Suppress the die() from config.php by capturing output or just seeing if it finishes
// Actually, config.php will die if it fails.
echo "Starting test...\n";
try {
    require_once 'backend/config.php';
    echo "Config loaded successfully.\n";
    if (isset($conn) && !$conn->connect_error) {
        echo "Connection is active.\n";
    } else {
        echo "Connection is NOT active.\n";
    }
} catch (Throwable $e) {
    echo "Caught exception: " . $e->getMessage() . "\n";
}
?>
