<?php
require_once '../middleware.php';
header("Content-Type: application/json");

// Feature-01 RBAC Check
if (!isset($_SESSION['user_id'])) {
    send_response(false, 'Unauthorized. Please log in.', [], 401);
}
require_admin();
$admin_id = $_SESSION['user_id'];

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // List all missions across the platform
    $query = "
        SELECT m.id, m.title, m.priority, m.status, m.due_date, m.created_at, m.is_deleted, u.username, u.team 
        FROM missions m
        JOIN users u ON m.user_id = u.id
        ORDER BY m.created_at DESC
    ";
    
    $result = $conn->query($query);
    $missions = [];
    while ($row = $result->fetch_assoc()) {
        $missions[] = $row;
    }
    
    send_response(true, 'Global missions retrieved.', ['missions' => $missions]);
}
elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    // Feature-06 Permanent delete
    $data = json_decode(file_get_contents("php://input"), true);
    
    // Admin permanent delete older than 30 days logic could be triggered here or as a CRON
    // We provide an explicit permanent delete for a specific mission id or all eligible
    if (isset($data['action']) && $data['action'] === 'permanent_cleanup') {
        $stmt = $conn->prepare("DELETE FROM missions WHERE is_deleted = TRUE AND deleted_at < DATE_SUB(NOW(), INTERVAL 30 DAY)");
        $stmt->execute();
        $deleted = $stmt->affected_rows;
        $stmt->close();
        log_admin_activity($admin_id, "Permanently deleted $deleted old soft-deleted missions", null);
        
        send_response(true, "$deleted obsolete missions permanently terminated.");
    } 
    elseif (isset($data['id'])) {
        $mission_id = intval($data['id']);
        $stmt = $conn->prepare("DELETE FROM missions WHERE id = ?");
        $stmt->bind_param("i", $mission_id);
        if ($stmt->execute()) {
            log_admin_activity($admin_id, "Permanently deleted mission ID $mission_id", null);
            send_response(true, "Mission record permanently purged.");
        } else {
            send_response(false, "Failed to purge mission.", [], 500);
        }
    } else {
         send_response(false, 'Missing id or action.', [], 400); 
    }
} else {
    send_response(false, 'Method not allowed.', [], 405);
}
?>
