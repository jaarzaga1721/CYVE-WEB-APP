<?php
require_once 'middleware.php';
header("Content-Type: application/json");

if (!isset($_SESSION['user_id'])) {
    send_response(false, 'Unauthorized. Please log in.', [], 401);
}

$user_id = $_SESSION['user_id'];

use CYVE\Repositories\UserRepository;
$userRepo = new UserRepository($conn);

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $profileData = $userRepo->getProfileData($user_id);
    if ($profileData !== false) {
        send_response(true, 'Profile retrieved', ['profile' => $profileData]);
    } else {
        send_response(false, 'User not found', [], 404);
    }
} 
elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    if (!$data) {
        send_response(false, 'Invalid data payload', [], 400);
    }

    $profile_json = json_encode($data);
    
    if ($userRepo->updateProfile($user_id, $profile_json)) {
        send_response(true, 'Profile saved to security database.');
    } else {
        send_response(false, 'Failed to update dossier.', [], 500);
    }
}
?>
