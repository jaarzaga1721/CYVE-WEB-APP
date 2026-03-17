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

$user_id = $_SESSION['user_id'];

use CYVE\Repositories\EventRepository;

$eventRepo = new EventRepository($conn);

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $events = $eventRepo->getByUserId($user_id);
    send_response(true, 'Events retrieved', ['events' => $events]);
} 
elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    
    // Handle restore action
    if (isset($data['action']) && $data['action'] === 'restore') {
        if (!isset($data['id'])) {
            send_response(false, 'Missing mission ID', [], 400);
        }
        if ($eventRepo->restore(intval($data['id']), $user_id)) {
            log_activity($user_id, 'mission_created', 'Mission restored to active logs');
            send_response(true, 'Mission restored successfully.');
        } else {
            send_response(false, 'Failed to restore mission.', [], 500);
        }
    }

    // Default create action
    if (!isset($data['title']) || !isset($data['event_date'])) {
        send_response(false, 'Missing required event fields', [], 400);
    }

    $title = sanitize($data['title']);
    $description = isset($data['description']) ? sanitize($data['description']) : '';
    $event_date = sanitize($data['event_date']);
    $location = isset($data['location']) ? sanitize($data['location']) : 'HQ';

    $insertId = $eventRepo->create($user_id, $title, $description, $event_date, $location);

    if ($insertId) {
        log_activity($user_id, 'mission_created', 'Created mission: ' . $title);
        send_response(true, 'Mission scheduled in CYVE database.', ['id' => $insertId]);
    } else {
        send_response(false, 'Failed to log mission to HQ.', [], 500);
    }
}
elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $data = json_decode(file_get_contents("php://input"), true);
    if (!isset($data['id'])) {
        send_response(false, 'Missing event ID', [], 400);
    }

    $id = intval($data['id']);
    if ($eventRepo->delete($id, $user_id)) {
        log_activity($user_id, 'mission_deleted', 'Mission scrubbed from active logs'); // Using custom or existing log action
        send_response(true, 'Mission scrubbed from records.');
    } else {
        send_response(false, 'Failed to delete event.', [], 500);
    }
}
?>
