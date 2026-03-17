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

use CYVE\Repositories\RoadmapRepository;

$user_id = $_SESSION['user_id'];
$repo = new RoadmapRepository($conn);

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $steps = $repo->getByUserId($user_id);
    
    if ($steps !== null) {
        send_response(true, 'Roadmap retrieved', ['steps' => $steps]);
    } else {
        send_response(true, 'No roadmap initialized', ['steps' => null]);
    }
} 
elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    if (!isset($data['steps'])) {
        send_response(false, 'Missing steps data', [], 400);
    }

    $title = $data['title'] ?? 'My Career Roadmap';

    if ($repo->save($user_id, $title, $data['steps'])) {
        send_response(true, 'Roadmap progress secured in the grid.');
    } else {
        send_response(false, 'Failed to save roadmap to headquarters.', [], 500);
    }
}
?>
