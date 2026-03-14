<?php
require_once 'middleware.php';
header("Content-Type: application/json");

// Feature-03: Team Change Requests (Operative Facing)
if (!isset($_SESSION['user_id'])) {
    send_response(false, 'Unauthorized. Please log in.', [], 401);
}

$user_id = $_SESSION['user_id'];

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Check pending requests for user
    $stmt = $conn->prepare("SELECT requested_team, status, created_at FROM team_change_requests WHERE user_id = ? AND status = 'pending' ORDER BY created_at DESC LIMIT 1");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($row = $result->fetch_assoc()) {
        send_response(true, 'Pending request found', ['request' => $row]);
    } else {
        send_response(true, 'No pending request', ['request' => null]);
    }
} 
elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    
    if (!isset($data['requested_team']) || !isset($data['reason'])) {
        send_response(false, 'Missing required fields', [], 400);
    }
    
    $requested_team = sanitize($data['requested_team']);
    $reason = sanitize($data['reason']);
    
    // Check if pending request exists
    $stmt = $conn->prepare("SELECT id FROM team_change_requests WHERE user_id = ? AND status = 'pending'");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    if ($stmt->get_result()->num_rows > 0) {
        send_response(false, 'You already have a pending specialization request.', [], 409);
    }
    
    // Get current team
    $stmt = $conn->prepare("SELECT team FROM users WHERE id = ?");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $current_team = $stmt->get_result()->fetch_assoc()['team'];
    
    if ($current_team === $requested_team) {
        send_response(false, 'You are already in this specialization.', [], 400);
    }
    
    // Insert new request
    $stmt = $conn->prepare("INSERT INTO team_change_requests (user_id, current_team, requested_team, reason) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("isss", $user_id, $current_team, $requested_team, $reason);
    
    if ($stmt->execute()) {
        log_activity($user_id, 'team_changed', "Requested specialization change: $current_team -> $requested_team");
        send_response(true, 'Specialization change request sent to HQ.');
    } else {
        send_response(false, 'Failed to submit request.', [], 500);
    }
} else {
    send_response(false, 'Method not allowed.', [], 405);
}
?>
