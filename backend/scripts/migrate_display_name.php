<?php
include __DIR__ . '/config.php';
$sql = "ALTER TABLE users ADD COLUMN display_name VARCHAR(100) AFTER username";
if ($conn->query($sql) === TRUE) {
    echo "Column display_name added successfully\n";
} else {
    echo "Error adding column: " . $conn->error . "\n";
}
$conn->close();
?>
