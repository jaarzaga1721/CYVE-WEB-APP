<?php
require_once '../middleware.php';
header("Content-Type: application/json");

// Feature-03: Team Change Requests (Admin Facing)
if (!isset($_SESSION['user_id'])) {
    send_response(false, 'Unauthorized. Please log in.', [], 401);
}
require_admin();

$admin_id = $_SESSION['user_id'];

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $status = isset($_GET['status']) ? sanitize($_GET['status']) : 'pending';
    
    // Admin list all requests
    $stmt = $conn->prepare("
        SELECT r.id, r.current_team, r.requested_team, r.reason, r.status, r.created_at, u.username, u.display_name 
        FROM team_change_requests r
        JOIN users u ON r.user_id = u.id
        WHERE r.status = ?
        ORDER BY r.created_at DESC
    ");
    $stmt->bind_param("s", $status);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $requests = [];
    while ($row = $result->fetch_assoc()) {
        $requests[] = $row;
    }
    
    send_response(true, 'Team requests loaded', ['requests' => $requests]);
} 
elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Approve or Reject request
    $data = json_decode(file_get_contents("php://input"), true);
    
    if (!isset($data['request_id']) || !isset($data['action'])) {
        send_response(false, 'Missing required fields', [], 400);
    }
    
    $request_id = intval($data['request_id']);
    $action = $data['action'] === 'approve' ? 'approved' : 'rejected';
    $review_note = isset($data['review_note']) ? sanitize($data['review_note']) : '';
    
    // Start transaction
    $conn->begin_transaction();
    try {
        // Fetch request details
        $stmt = $conn->prepare("SELECT user_id, requested_team, status FROM team_change_requests WHERE id = ? FOR UPDATE");
        $stmt->bind_param("i", $request_id);
        $stmt->execute();
        $req = $stmt->get_result()->fetch_assoc();
        
        if (!$req || $req['status'] !== 'pending') {
            throw new Exception("Request not found or already processed.");
        }
        
        $target_user = $req['user_id'];
        $new_team = $req['requested_team'];
        
        // Update request status
        $stmt = $conn->prepare("UPDATE team_change_requests SET status = ?, reviewed_by = ?, review_note = ?, reviewed_at = NOW() WHERE id = ?");
        $stmt->bind_param("sisi", $action, $admin_id, $review_note, $request_id);
        $stmt->execute();
        
        // Target User Change if approved
        if ($action === 'approved') {
            $stmt = $conn->prepare("UPDATE users SET team = ? WHERE id = ?");
            $stmt->bind_param("si", $new_team, $target_user);
            $stmt->execute();
            
            // Auto trigger notification (Feature-05 implementation hooks)
            $stmt = $conn->prepare("INSERT INTO notifications (user_id, type, title, message) VALUES (?, 'team_approved', 'SPECIALIZATION CHANGE APPROVED', ?)");
            $approved_message = "Your transfer to $new_team TEAM has been approved by admin.";
            $stmt->bind_param("is", $target_user, $approved_message);
            $stmt->execute();
        } else {
             // Auto trigger rejection notification
             $stmt = $conn->prepare("INSERT INTO notifications (user_id, type, title, message) VALUES (?, 'team_rejected', 'SPECIALIZATION CHANGE REJECTED', ?)");
             $rejected_message = "Your transfer to $new_team TEAM was rejected. HQ Note: " . ($review_note ?: "No reason provided.");
             $stmt->bind_param("is", $target_user, $rejected_message);
             $stmt->execute();
        }
        
        // Log admin activity
        log_admin_activity($admin_id, "Reviewed request $request_id: $action", $target_user);
        
        $conn->commit();
        send_response(true, "Request successfully $action.");
        
    } catch (Exception $e) {
        $conn->rollback();
        send_response(false, "Transaction failed: " . $e->getMessage(), [], 500);
    }
} else {
    send_response(false, 'Method not allowed.', [], 405);
}
?>
