<?php
/**
 * GET/POST /api/network/privacy
 * Manage operative privacy settings.
 */
require_once __DIR__ . '/../../api/middleware.php';

if (!isset($_SESSION['user_id'])) {
    send_response(false, 'UNAUTHORIZED', [], 401);
}

$user_id = (int) $_SESSION['user_id'];

// Handle GET: Fetch settings
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $conn->prepare("SELECT dossier_visibility, show_progress, show_skills, show_rank, allow_links FROM operative_privacy WHERE user_id = ?");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $res = $stmt->get_result()->fetch_assoc();
    $stmt->close();

    if (!$res) {
        $res = [
            'dossier_visibility' => 'public',
            'show_progress' => true,
            'show_skills' => true,
            'show_rank' => true,
            'allow_links' => true
        ];
    }
    
    // Ensure booleans are typed correctly for JS
    $res['show_progress'] = (bool)$res['show_progress'];
    $res['show_skills']   = (bool)$res['show_skills'];
    $res['show_rank']     = (bool)$res['show_rank'];
    $res['allow_links']   = (bool)$res['allow_links'];

    send_response(true, 'CLEARANCE_LOADED', $res);
    exit;
}

// Handle POST/PUT: Update settings
if ($_SERVER['REQUEST_METHOD'] !== 'POST' && $_SERVER['REQUEST_METHOD'] !== 'PUT') {
    send_response(false, 'Method not allowed', [], 405);
}

$body = json_decode(file_get_contents('php://input'), true);

$allowed_visibilities = ['public', 'unit_only', 'allies_only', 'classified'];
$visibility = in_array($body['dossier_visibility'] ?? '', $allowed_visibilities)
    ? $body['dossier_visibility']
    : 'public';

$show_progress = isset($body['show_progress']) ? (int) $body['show_progress'] : 1;
$show_skills   = isset($body['show_skills'])   ? (int) $body['show_skills']   : 1;
$show_rank     = isset($body['show_rank'])     ? (int) $body['show_rank']     : 1;
$allow_links   = isset($body['allow_links'])   ? (int) $body['allow_links']   : 1;

// Upsert privacy settings
$stmt = $conn->prepare("
    INSERT INTO operative_privacy (user_id, dossier_visibility, show_progress, show_skills, show_rank, allow_links)
    VALUES (?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
        dossier_visibility = VALUES(dossier_visibility),
        show_progress = VALUES(show_progress),
        show_skills = VALUES(show_skills),
        show_rank = VALUES(show_rank),
        allow_links = VALUES(allow_links)
");
$stmt->bind_param("isiiii", $user_id, $visibility, $show_progress, $show_skills, $show_rank, $allow_links);
$stmt->execute();
$stmt->close();

send_response(true, 'CLEARANCE_UPDATED', [
    'dossier_visibility' => $visibility,
    'show_progress'      => (bool)$show_progress,
    'show_skills'        => (bool)$show_skills,
    'show_rank'          => (bool)$show_rank,
    'allow_links'        => (bool)$allow_links,
]);
?>
