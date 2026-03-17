<?php
$conn = new mysqli('127.0.0.1', 'root', '', 'cyve');
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
$result = $conn->query("SHOW TABLES");
if ($result) {
    $tables = [];
    while ($row = $result->fetch_array()) {
        $tables[] = $row[0];
    }
    echo "Tables in 'cyve': " . implode(", ", $tables) . "\n";
} else {
    echo "Could not list tables: " . $conn->error . "\n";
}
$conn->close();
?>
