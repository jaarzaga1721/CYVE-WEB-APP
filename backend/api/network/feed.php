<?php
/**
 * GET /api/network/feed?filter=all&page=1
 * Returns paginated signal feed events.
 * Filters: all | unit | allies | platform
 */
require_once __DIR__ . '/../../api/middleware.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    send_response(false, 'Method not allowed', [], 405);
}

if (!isset($_SESSION['user_id'])) {
    send_response(false, 'UNAUTHORIZED', [], 401);
}

$user_id = (int) $_SESSION['user_id'];
$filter  = sanitize($_GET['filter'] ?? 'all');
$page    = max(1, (int) ($_GET['page'] ?? 1));
$limit   = 20;
$offset  = ($page - 1) * $limit;

// Determine which user IDs to show feed for
switch ($filter) {
    case 'allies':
        $scope_sql = "AND sf.user_id IN (
            SELECT CASE WHEN requester_id = $user_id THEN receiver_id ELSE requester_id END
            FROM operative_links WHERE (requester_id = $user_id OR receiver_id = $user_id) AND status = 'active'
        )";
        break;
    case 'unit':
        $me = $conn->query("SELECT team FROM profile_data WHERE user_id = $user_id")->fetch_assoc();
        $my_team = sanitize($me['team'] ?? '');
        $scope_sql = $my_team
            ? "AND sf.user_id IN (SELECT user_id FROM profile_data WHERE team = '$my_team')"
            : "AND sf.user_id = $user_id";
        break;
    case 'platform':
        $scope_sql = "AND u_privacy.dossier_visibility = 'public'";
        break;
    default: // 'all' — self + allies
        $scope_sql = "AND (sf.user_id = $user_id OR sf.user_id IN (
            SELECT CASE WHEN requester_id = $user_id THEN receiver_id ELSE requester_id END
            FROM operative_links WHERE (requester_id = $user_id OR receiver_id = $user_id) AND status = 'active'
        ))";
}

$sql = "
    SELECT sf.id, sf.user_id, sf.event_type, sf.event_data, sf.created_at,
           u.display_name, u.name, pr.team, pr.rank,
           op.dossier_visibility AS u_visibility
    FROM signal_feed sf
    JOIN users u ON u.id = sf.user_id
    LEFT JOIN profile_data pr ON pr.user_id = sf.user_id
    LEFT JOIN operative_privacy op AS u_privacy ON op.user_id = sf.user_id
    WHERE 1=1 $scope_sql
    ORDER BY sf.created_at DESC
    LIMIT $limit OFFSET $offset
";

$result = $conn->query($sql);
$events = [];
if ($result) {
    while ($row = $result->fetch_assoc()) {
        $event_data = json_decode($row['event_data'] ?? '{}', true);
        $events[] = [
            'id'           => (int) $row['id'],
            'user_id'      => (int) $row['user_id'],
            'display_name' => $row['display_name'] ?? $row['name'] ?? 'OPERATIVE',
            'team'         => $row['team'],
            'rank'         => $row['rank'],
            'event_type'   => $row['event_type'],
            'event_data'   => $event_data,
            'created_at'   => $row['created_at'],
        ];
    }
}

$next_page = count($events) === $limit ? $page + 1 : null;
send_response(true, 'FEED_RETRIEVED', ['events' => $events, 'next_page' => $next_page]);
?>
