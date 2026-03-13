<?php
$conn = new mysqli('localhost', 'root', '', 'cyve');
if ($conn->connect_error) die('Connection failed');
$sql = "ALTER TABLE operative_privacy MODIFY COLUMN dossier_visibility ENUM('public', 'unit_only', 'allies_only', 'classified') DEFAULT 'public'";
if ($conn->query($sql)) echo 'SCHEMA_UPDATED'; else echo 'FAIL: ' . $conn->error;
$conn->close();
?>
