<?php
require_once 'middleware.php';
header("Content-Type: application/json");

if (!isset($_SESSION['user_id'])) {
    send_response(false, 'Unauthorized. Please log in.', [], 401);
}

$user_id = $_SESSION['user_id'];

use CYVE\Repositories\EventRepository;

$eventRepo = new EventRepository($conn);

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $events = $eventRepo->getByUserId($user_id);
    send_response(true, 'Events retrieved', ['events' => $events]);
} 
elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    
    if (!isset($data['title']) || !isset($data['event_date'])) {
        send_response(false, 'Missing required event fields', [], 400);
    }

    $title = sanitize($data['title']);
    $description = isset($data['description']) ? sanitize($data['description']) : '';
    $event_date = sanitize($data['event_date']);
    $location = isset($data['location']) ? sanitize($data['location']) : 'HQ';

    $insertId = $eventRepo->create($user_id, $title, $description, $event_date, $location);

    if ($insertId) {
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
        send_response(true, 'Mission scrubbed from records.');
    } else {
        send_response(false, 'Failed to delete event.', [], 500);
    }
}
?>
