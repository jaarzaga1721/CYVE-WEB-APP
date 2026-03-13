<?php
/**
 * GET /api/network/scan?q=&team=&rank=
 * Search operatives by name, team, or rank.
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
$q      = sanitize($_GET['q'] ?? '');
$team   = sanitize($_GET['team'] ?? '');
$rank   = sanitize($_GET['rank'] ?? '');

// Build dynamic WHERE clause
$conditions = ['u.id != ?', "op.dossier_visibility != 'classified'"];
$params = [$user_id];
$types = 'i';

if ($q) {
    $conditions[] = "(u.display_name LIKE ? OR u.name LIKE ?)";
    $like = "%$q%";
    $params[] = $like;
    $params[] = $like;
    $types .= 'ss';
}

if ($team) {
    $conditions[] = "pr.team = ?";
    $params[] = $team;
    $types .= 's';
}

if ($rank) {
    $conditions[] = "pr.rank = ?";
    $params[] = $rank;
    $types .= 's';
}

$where = implode(' AND ', $conditions);

// Get link status for each result
$sql = "
    SELECT 
        u.id, u.display_name, u.name,
        pr.team, pr.rank, pr.skills, pr.progress_percent,
        op.dossier_visibility, op.show_skills, op.show_progress, op.show_rank, op.allow_links,
        ol.id AS link_id, ol.status AS link_status, ol.requester_id
    FROM users u
    LEFT JOIN profile_data pr ON pr.user_id = u.id
    LEFT JOIN operative_privacy op ON op.user_id = u.id
    LEFT JOIN operative_links ol ON (
        (ol.requester_id = $user_id AND ol.receiver_id = u.id) OR
        (ol.receiver_id = $user_id AND ol.requester_id = u.id)
    ) AND ol.status != 'terminated'
    WHERE $where
    ORDER BY pr.xp DESC
    LIMIT 50
";

$stmt = $conn->prepare($sql);
$stmt->bind_param($types, ...$params);
$stmt->execute();
$result = $stmt->get_result();
$stmt->close();

$operatives = [];
while ($row = $result->fetch_assoc()) {
    $skills_raw = json_decode($row['skills'] ?? '[]', true);
    // Determine connection state label
    $conn_status = 'not_connected';
    if ($row['link_status'] === 'active') {
        $conn_status = 'active';
    } elseif ($row['link_status'] === 'pending') {
        $conn_status = ($row['requester_id'] == $user_id) ? 'pending_outgoing' : 'pending_incoming';
    }
    if (!$row['allow_links']) $conn_status = 'classified';

    // Check clearance before returning data
    $clearance = get_operative_clearance($conn, $user_id, (int)$row['id']);
    
    // If blocked, omit sensitive data or skip (usually search might show them but classified)
    // According to spec: 'classified' dossiers are excluded from results in some tabs.
    if ($clearance === 'blocked') continue; 

    $is_partial = ($clearance === 'partial');

    $operatives[] = [
        'id'               => (int) $row['id'],
        'display_name'     => $row['display_name'] ?? $row['name'] ?? 'OPERATIVE',
        'team'             => $row['team'] ?? null,
        'rank'             => ($row['show_rank'] && !$is_partial) ? ($row['rank'] ?? 'RECRUIT') : 'CLASSIFIED',
        'skills'           => (!$is_partial && $row['show_skills'] && is_array($skills_raw)) ? array_slice($skills_raw, 0, 3) : [],
        'progress_percent' => (!$is_partial && $row['show_progress']) ? (int) ($row['progress_percent'] ?? 0) : null,
        'link_id'          => $row['link_id'] ? (int) $row['link_id'] : null,
        'link_status'      => $conn_status,
        'dossier_visibility' => $row['dossier_visibility'] ?? 'public',
        'shared_allies'    => get_shared_allies_count($conn, $user_id, (int)$row['id']),
    ];
}

send_response(true, 'SCAN_COMPLETE', ['results' => $operatives, 'count' => count($operatives)]);
?>
