<?php
// STEP 1: CORS always comes first — before everything
require_once __DIR__ . '/../cors.php';

// STEP 2: Auth check comes AFTER cors
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['error' => 'Unauthorized', 'code' => 401]);
    http_response_code(401);
    exit();
}

require_once '../middleware.php';
require_once '../response.php';

// RBAC Check for Admin Access
require_admin();
$admin_id = $_SESSION['user_id'];

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // List all pending requests
    $query = "
        SELECT r.id, r.requested_team, r.reason, r.created_at, u.username, u.email, u.team as current_team
        FROM team_change_requests r
        JOIN users u ON r.user_id = u.id
        WHERE r.status = 'pending'
        ORDER BY r.created_at ASC
    ";
    
    $result = $conn->query($query);
    $requests = [];
    while ($row = $result->fetch_assoc()) {
        $requests[] = $row;
    }
    
    send_response(true, 'Pending specialization requests retrieved.', ['requests' => $requests]);
}
elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Review a request
    $data = json_decode(file_get_contents("php://input"), true);
    
    if (!isset($data['id']) || !isset($data['status'])) {
        send_response(false, 'Missing request ID or decision status.', [], 400);
    }
    
    $request_id = intval($data['id']);
    $status = ($data['status'] === 'approved') ? 'approved' : 'rejected';
    $note = isset($data['note']) ? sanitize($data['note']) : '';
    
    // Fetch request details
    $stmt = $conn->prepare("SELECT user_id, requested_team FROM team_change_requests WHERE id = ? AND status = 'pending'");
    $stmt->bind_param("i", $request_id);
    $stmt->execute();
    $request = $stmt->get_result()->fetch_assoc();
    
    if (!$request) {
        send_response(false, 'Request not found or already processed.', [], 404);
    }
    
    $target_user_id = $request['user_id'];
    $requested_team = $request['requested_team'];
    
    // Update request
    $stmt = $conn->prepare("UPDATE team_change_requests SET status = ?, reviewed_by = ?, review_note = ?, reviewed_at = NOW() WHERE id = ?");
    $stmt->bind_param("sisi", $status, $admin_id, $note, $request_id);
    
    if ($stmt->execute()) {
        if ($status === 'approved') {
            // Update user team
            $stmt = $conn->prepare("UPDATE users SET team = ? WHERE id = ?");
            $stmt->bind_param("si", $requested_team, $target_user_id);
            $stmt->execute();
            
            // Log and notify
            log_admin_activity($admin_id, "Approved specialization: $requested_team for user $target_user_id", $target_user_id);
            log_activity($target_user_id, 'team_joined', "Specialization approved: $requested_team by HQ");
            
            // Create notification
            $notif_title = "SPECIALIZATION_APPROVED";
            $notif_msg = "Your request for $requested_team clearance has been approved by HQ. Access granted.";
            $stmt = $conn->prepare("INSERT INTO notifications (user_id, type, title, message) VALUES (?, 'team_approved', ?, ?)");
            $stmt->bind_param("iss", $target_user_id, $notif_title, $notif_msg);
            $stmt->execute();
            
        } else {
            // Rejection
            log_admin_activity($admin_id, "Rejected specialization request for user $target_user_id", $target_user_id);
            
            // Create notification
            $notif_title = "SPECIALIZATION_REJECTED";
            $notif_msg = "Your request for $requested_team clearance was denied. Note: $note";
            $stmt = $conn->prepare("INSERT INTO notifications (user_id, type, title, message) VALUES (?, 'team_rejected', ?, ?)");
            $stmt->bind_param("iss", $target_user_id, $notif_title, $notif_msg);
            $stmt->execute();
        }
        
        send_response(true, "Request processed as $status.");
    } else {
        send_response(false, "Failed to update specialization state.", [], 500);
    }
} else {
    send_response(false, 'Method not allowed.', [], 405);
}
?>
