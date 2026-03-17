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
 * GET /api/network/pending
 * Returns incoming and outgoing pending link requests.
 */
require_once __DIR__ . '/../../api/middleware.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    send_response(false, 'Method not allowed', [], 405);
}

if (!isset($_SESSION['user_id'])) {
    send_response(false, 'UNAUTHORIZED', [], 401);
}

$user_id = (int) $_SESSION['user_id'];

// Incoming requests (user is receiver)
$in_stmt = $conn->prepare("
    SELECT ol.id AS link_id, ol.created_at,
           u.id, u.display_name, u.name,
           pr.team, pr.rank, pr.skills, pr.progress_percent
    FROM operative_links ol
    JOIN users u ON u.id = ol.requester_id
    LEFT JOIN profile_data pr ON pr.user_id = u.id
    WHERE ol.receiver_id = ? AND ol.status = 'pending'
    ORDER BY ol.created_at DESC
");
$in_stmt->bind_param("i", $user_id);
$in_stmt->execute();
$in_result = $in_stmt->get_result();
$in_stmt->close();

$incoming = [];
while ($row = $in_result->fetch_assoc()) {
    $skills_raw = json_decode($row['skills'] ?? '[]', true);
    $incoming[] = [
        'link_id'          => (int) $row['link_id'],
        'id'               => (int) $row['id'],
        'display_name'     => $row['display_name'] ?? $row['name'] ?? 'OPERATIVE',
        'team'             => $row['team'] ?? null,
        'rank'             => $row['rank'] ?? 'RECRUIT',
        'skills'           => is_array($skills_raw) ? array_slice($skills_raw, 0, 3) : [],
        'progress_percent' => (int) ($row['progress_percent'] ?? 0),
        'link_status'      => 'pending_incoming',
        'created_at'       => $row['created_at'],
    ];
}

// Outgoing requests (user is requester)
$out_stmt = $conn->prepare("
    SELECT ol.id AS link_id, ol.created_at,
           u.id, u.display_name, u.name,
           pr.team, pr.rank, pr.skills, pr.progress_percent
    FROM operative_links ol
    JOIN users u ON u.id = ol.receiver_id
    LEFT JOIN profile_data pr ON pr.user_id = u.id
    WHERE ol.requester_id = ? AND ol.status = 'pending'
    ORDER BY ol.created_at DESC
");
$out_stmt->bind_param("i", $user_id);
$out_stmt->execute();
$out_result = $out_stmt->get_result();
$out_stmt->close();

$outgoing = [];
while ($row = $out_result->fetch_assoc()) {
    $skills_raw = json_decode($row['skills'] ?? '[]', true);
    $outgoing[] = [
        'link_id'          => (int) $row['link_id'],
        'id'               => (int) $row['id'],
        'display_name'     => $row['display_name'] ?? $row['name'] ?? 'OPERATIVE',
        'team'             => $row['team'] ?? null,
        'rank'             => $row['rank'] ?? 'RECRUIT',
        'skills'           => is_array($skills_raw) ? array_slice($skills_raw, 0, 3) : [],
        'progress_percent' => (int) ($row['progress_percent'] ?? 0),
        'link_status'      => 'pending_outgoing',
        'created_at'       => $row['created_at'],
    ];
}

$total_pending = count($incoming) + count($outgoing);
send_response(true, 'PENDING_RETRIEVED', [
    'incoming' => $incoming,
    'outgoing' => $outgoing,
    'total_pending' => $total_pending,
]);
?>
