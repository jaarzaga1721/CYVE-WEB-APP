<?php
$conn = new mysqli('localhost', 'root', '', 'cyve');
if ($conn->connect_error) die('Connection failed');

$migration = file_get_contents(__DIR__ . '/network_migration.sql');
if ($conn->multi_query($migration)) {
    do { if ($res = $conn->store_result()) $res->free(); } while ($conn->next_result());
    echo "PHASE1_SYNCED ";
} else {
    echo "PHASE1_ERROR: " . $conn->error . " ";
}

$update = "ALTER TABLE operative_privacy MODIFY COLUMN dossier_visibility ENUM('public', 'unit_only', 'allies_only', 'classified') DEFAULT 'public'";
if ($conn->query($update)) echo "PHASE3_UPDATED"; else echo "PHASE3_ERROR: " . $conn->error;

$conn->close();
?>
