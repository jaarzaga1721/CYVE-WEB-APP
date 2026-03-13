<?php
/**
 * POST /api/network/accept
 * Accept an incoming link request.
 */
require_once __DIR__ . '/../../api/middleware.php';
require_once __DIR__ . '/utils.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    send_response(false, 'Method not allowed', [], 405);
}

if (!isset($_SESSION['user_id'])) {
    send_response(false, 'UNAUTHORIZED — No active session', [], 401);
}

$user_id = (int) $_SESSION['user_id'];
$body = json_decode(file_get_contents('php://input'), true);
$link_id = (int) ($body['link_id'] ?? 0);

if (!$link_id) {
    send_response(false, 'Invalid link_id', [], 400);
}

// Verify the current user is the receiver
$stmt = $conn->prepare("SELECT id, requester_id FROM operative_links WHERE id = ? AND receiver_id = ? AND status = 'pending'");
$stmt->bind_param("ii", $link_id, $user_id);
$stmt->execute();
$link = $stmt->get_result()->fetch_assoc();
$stmt->close();

if (!$link) {
    send_response(false, 'Link request not found or already resolved', [], 404);
}

// Update status to active
$update = $conn->prepare("UPDATE operative_links SET status = 'active', updated_at = NOW() WHERE id = ?");
$update->bind_param("i", $link_id);
$update->execute();
$update->close();

// Log to signal_feed for both users using central utility
$event_data1 = ['link_id' => $link_id, 'with_user' => $link['requester_id']];
$requester_id = $link['requester_id'];
log_signal_event($conn, $user_id, 'link_established', $event_data1);

$event_data2 = ['link_id' => $link_id, 'with_user' => $user_id];
log_signal_event($conn, $requester_id, 'link_established', $event_data2);

send_response(true, 'LINK_ESTABLISHED', ['status' => 'active', 'link_id' => $link_id]);
?>
