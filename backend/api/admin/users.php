<?php
// STEP 1: CORS always comes first — before everything
require_once __DIR__ . '/../cors.php';

// STEP 2: Auth check comes AFTER cors (this fixes the 401 errors)
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['error' => 'Unauthorized', 'code' => 401]);
    http_response_code(401);
    exit();
}

require_once '../middleware.php';

// Feature-01 RBAC Check
if (!isset($_SESSION['user_id'])) {
    send_response(false, 'Unauthorized. Please log in.', [], 401);
}
require_admin();

$admin_id = $_SESSION['user_id'];

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // List all users
    $stmt = $conn->prepare("SELECT id, username, email, display_name, role, team, roadmap_progress, rank, created_at FROM users ORDER BY created_at DESC");
    $stmt->execute();
    $result = $stmt->get_result();
    
    $users = [];
    while ($row = $result->fetch_assoc()) {
        $users[] = $row;
    }
    
    send_response(true, 'User data retrieved.', ['users' => $users]);
}
elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Modify an operative (suspend/reassign team)
    $data = json_decode(file_get_contents("php://input"), true);
    if (!isset($data['action']) || !isset($data['target_user'])) {
        send_response(false, 'Missing action or target_user', [], 400);
    }

    $target_user = intval($data['target_user']);
    $action = $data['action'];

    if ($action === 'assign_team') {
        if (!isset($data['team'])) {
            send_response(false, 'Missing team for reassignment.', [], 400);
        }
        $team = sanitize($data['team']);
        $stmt = $conn->prepare("UPDATE users SET team = ? WHERE id = ?");
        $stmt->bind_param("si", $team, $target_user);
        
        if ($stmt->execute()) {
            log_admin_activity($admin_id, "Assigned user $target_user to team $team", $target_user);
            send_response(true, "Operative assigned to $team.");
        } else {
            send_response(false, "Failed to reassign operative.", [], 500);
        }
    } else {
        send_response(false, "Unknown action.", [], 400);
    }
} else {
    send_response(false, 'Method not allowed.', [], 405);
}
?>
