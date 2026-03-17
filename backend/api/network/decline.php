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
 * POST /api/network/decline
 * Decline an incoming link request.
 */
require_once __DIR__ . '/../../api/middleware.php';

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

// Only receiver can decline
$stmt = $conn->prepare("DELETE FROM operative_links WHERE id = ? AND receiver_id = ? AND status = 'pending'");
$stmt->bind_param("ii", $link_id, $user_id);
$stmt->execute();
$affected = $stmt->affected_rows;
$stmt->close();

if ($affected === 0) {
    send_response(false, 'Link request not found or already resolved', [], 404);
}

send_response(true, 'LINK_DECLINED', ['status' => 'declined', 'link_id' => $link_id]);
?>
