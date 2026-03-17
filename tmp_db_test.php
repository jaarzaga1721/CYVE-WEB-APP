<?php
$host = 'localhost';
$user = 'root';
$pass = '';
$db = 'cyve';

$conn = @new mysqli($host, $user, $pass);
if ($conn->connect_error) {
    echo "Connection failed (Host/User/Pass): " . $conn->connect_error . "\n";
} else {
    echo "Connected to MySQL successfully.\n";
    if ($conn->select_db($db)) {
        echo "Database '$db' selected successfully.\n";
    } else {
        echo "Database '$db' does not exist.\n";
        // Let's try to create it if it doesn't exist
        /*
        if ($conn->query("CREATE DATABASE IF NOT EXISTS $db")) {
            echo "Database '$db' created successfully.\n";
        } else {
            echo "Error creating database: " . $conn->error . "\n";
        }
        */
    }
    $conn->close();
}

// Try 127.0.0.1 as well
$host = '127.0.0.1';
$conn = @new mysqli($host, $user, $pass);
if ($conn->connect_error) {
    echo "Connection failed (127.0.0.1): " . $conn->connect_error . "\n";
} else {
    echo "Connected to MySQL via 127.0.0.1 successfully.\n";
    $conn->close();
}
?>
