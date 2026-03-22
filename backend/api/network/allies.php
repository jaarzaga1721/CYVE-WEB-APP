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
 * GET /api/network/allies
 * Returns all active connections with full operative card data.
 */
require_once __DIR__ . '/../../api/middleware.php';
require_once __DIR__ . '/utils.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    send_response(false, 'Method not allowed', [], 405);
}

if (!isset($_SESSION['user_id'])) {
    send_response(false, 'UNAUTHORIZED', [], 401);
}

$user_id = (int) $_SESSION['user_id'];

// Get all active allies with their profile data
$stmt = $conn->prepare("
    SELECT 
        ol.id AS link_id,
        u.id,
        u.display_name,
        u.username as name,
        u.email,
        u.profile_data,
        op.dossier_visibility,
        op.show_skills,
        op.show_progress,
        op.show_rank
    FROM operative_links ol
    JOIN users u ON (
        CASE WHEN ol.requester_id = ? THEN u.id = ol.receiver_id
             ELSE u.id = ol.requester_id END
    )
    LEFT JOIN operative_privacy op ON op.user_id = u.id
    WHERE (ol.requester_id = ? OR ol.receiver_id = ?)
      AND ol.status = 'active'
    ORDER BY ol.updated_at DESC
");
$stmt->bind_param("iii", $user_id, $user_id, $user_id);
$stmt->execute();
$result = $stmt->get_result();
$stmt->close();

$allies = [];
while ($row = $result->fetch_assoc()) {
    $profile = json_decode($row['profile_data'] ?? '{}', true);
    $visibility = $row['dossier_visibility'] ?? 'public';
    $skills = [];
    if ($row['show_skills'] && ($profile['skills'] ?? null)) {
        $skills = is_array($profile['skills']) ? array_slice($profile['skills'], 0, 3) : [];
    }
    $allies[] = [
        'link_id'          => (int) $row['link_id'],
        'id'               => (int) $row['id'],
        'display_name'     => $row['display_name'] ?? $row['name'] ?? 'OPERATIVE',
        'team'             => $profile['team'] ?? null,
        'rank'             => $row['show_rank'] ? ($profile['rank'] ?? 'RECRUIT') : null,
        'skills'           => $skills,
        'progress_percent' => $row['show_progress'] ? (int) ($profile['progress_percent'] ?? 0) : null,
        'xp'               => (int) ($profile['xp'] ?? 0),
        'link_status'      => 'active',
        'dossier_visibility' => $visibility,
        'shared_allies'    => get_shared_allies_count($conn, $user_id, (int)$row['id']),
    ];
}

send_response(true, 'ALLIES_RETRIEVED', ['allies' => $allies, 'count' => count($allies)]);
?>
