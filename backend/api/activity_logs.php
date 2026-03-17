<?php
// STEP 1: CORS always comes first — before everything
require_once __DIR__ . '/cors.php';

// STEP 2: Auth check comes AFTER cors (this fixes the 401 errors)
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['error' => 'Unauthorized', 'code' => 401]);
    http_response_code(401);
    exit();
}

require_once 'middleware.php';
header("Content-Type: application/json");

// Feature-02: Audit Trail / Activity Logs
if (!isset($_SESSION['user_id'])) {
    send_response(false, 'Unauthorized. Please log in.', [], 401);
}

$user_id = $_SESSION['user_id'];

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Only users themselves or admins can view activity logs
    // Right now, this returns the current user's logs
    $limit = isset($_GET['limit']) ? intval($_GET['limit']) : 20;

    $stmt = $conn->prepare("
        SELECT action_type, description, created_at, ip_address 
        FROM activity_logs 
        WHERE user_id = ? 
        ORDER BY created_at DESC 
        LIMIT ?
    ");
    
    $stmt->bind_param("ii", $user_id, $limit);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $logs = [];
    while ($row = $result->fetch_assoc()) {
        $logs[] = $row;
    }
    
    send_response(true, 'Signal logs retrieved.', ['logs' => $logs]);
} else {
    send_response(false, 'Method not allowed.', [], 405);
}
?>
