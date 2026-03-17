<?php
// STEP 1: CORS always comes first — before everything
require_once __DIR__ . '/../cors.php';

// STEP 2: Auth check comes AFTER cors (this fixes the 401 errors)
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['error' => 'Unauthorized', 'code' => 401]);
    http_response_code(401);
    exit();
}

/**
 * POST /api/network/request
 * Send a link request to another operative.
 */
require_once __DIR__ . '/../../api/middleware.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    send_response(false, 'Method not allowed', [], 405);
}

if (!isset($_SESSION['user_id'])) {
    send_response(false, 'UNAUTHORIZED — No active session', [], 401);
}

$requester_id = (int) $_SESSION['user_id'];
$body = json_decode(file_get_contents('php://input'), true);
$receiver_id = (int) ($body['receiver_id'] ?? 0);

if (!$receiver_id || $receiver_id === $requester_id) {
    send_response(false, 'Invalid receiver', [], 400);
}

// Check target operative's privacy settings
$privacy_stmt = $conn->prepare("SELECT allow_links FROM operative_privacy WHERE user_id = ?");
$privacy_stmt->bind_param("i", $receiver_id);
$privacy_stmt->execute();
$privacy = $privacy_stmt->get_result()->fetch_assoc();
$privacy_stmt->close();

if ($privacy && !$privacy['allow_links']) {
    send_response(false, 'DOSSIER_CLASSIFIED — Operative does not accept link requests', [], 403);
}

// Check if link already exists
$check = $conn->prepare("SELECT id, status FROM operative_links WHERE 
    (requester_id = ? AND receiver_id = ?) OR (requester_id = ? AND receiver_id = ?)");
$check->bind_param("iiii", $requester_id, $receiver_id, $receiver_id, $requester_id);
$check->execute();
$existing = $check->get_result()->fetch_assoc();
$check->close();

if ($existing) {
    if ($existing['status'] === 'active') {
        send_response(false, 'LINK_ALREADY_ACTIVE', [], 409);
    }
    if ($existing['status'] === 'pending') {
        send_response(false, 'LINK_REQUEST_PENDING', [], 409);
    }
    // Re-activate terminated link
    $update = $conn->prepare("UPDATE operative_links SET status='pending', requester_id=?, receiver_id=?, updated_at=NOW() WHERE id=?");
    $update->bind_param("iii", $requester_id, $receiver_id, $existing['id']);
    $update->execute();
    $link_id = $existing['id'];
    $update->close();
} else {
    $stmt = $conn->prepare("INSERT INTO operative_links (requester_id, receiver_id, status) VALUES (?, ?, 'pending')");
    $stmt->bind_param("ii", $requester_id, $receiver_id);
    $stmt->execute();
    $link_id = $stmt->insert_id;
    $stmt->close();
}

send_response(true, 'LINK_REQUEST_TRANSMITTED', ['status' => 'pending', 'link_id' => $link_id]);
?>
