<?php
require_once 'middleware.php';
header("Content-Type: application/json");

// Feature-05: Notification System (Operative/User Facing)
if (!isset($_SESSION['user_id'])) {
    send_response(false, 'Unauthorized. Please log in.', [], 401);
}

$user_id = $_SESSION['user_id'];

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Fetch notifications
    $limit = isset($_GET['limit']) ? intval($_GET['limit']) : 50;
    
    $stmt = $conn->prepare("SELECT id, type, title, message, is_read, created_at FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT ?");
    $stmt->bind_param("ii", $user_id, $limit);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $notifications = [];
    $unread_count = 0;
    
    while ($row = $result->fetch_assoc()) {
        $notifications[] = $row;
        if (!$row['is_read']) {
            $unread_count++;
        }
    }
    
    send_response(true, 'Notifications loaded.', [
        'notifications' => $notifications, 
        'unread_count' => $unread_count
    ]);
} 
elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    
    if (isset($data['action']) && $data['action'] === 'mark_all_read') {
        $stmt = $conn->prepare("UPDATE notifications SET is_read = TRUE WHERE user_id = ?");
        $stmt->bind_param("i", $user_id);
        $stmt->execute();
        send_response(true, 'All notification alerts acknowledged.');
    } 
    elseif (isset($data['id'])) {
        $notif_id = intval($data['id']);
        $stmt = $conn->prepare("UPDATE notifications SET is_read = TRUE WHERE id = ? AND user_id = ?");
        $stmt->bind_param("ii", $notif_id, $user_id);
        $stmt->execute();
        send_response(true, 'Alert marked as read.');
    } else {
        send_response(false, 'Missing notification ID or action format', [], 400);
    }
} else {
    send_response(false, 'Method not allowed.', [], 405);
}
?>
