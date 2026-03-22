<?php
$conn = @new mysqli('[::1]', 'root', '');
if ($conn->connect_error) {
    echo "Connection failed: " . $conn->connect_error;
} else {
    echo "SUCCESS";
    $conn->close();
}
?>
