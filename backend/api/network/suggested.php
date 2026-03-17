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
 * GET /api/network/suggested
 * Algorithm to find potential allies.
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

// Get current user's data
$me = $conn->query("
    SELECT pr.team, pr.rank, pr.progress_percent, pr.skills
    FROM profile_data pr WHERE pr.user_id = $user_id
")->fetch_assoc();

$my_team = $me['team'] ?? null;
$my_progress = (int) ($me['progress_percent'] ?? 0);

// Suggested: not already linked, not self, not classified, not pending
$stmt = $conn->prepare("
    SELECT 
        u.id, u.display_name, u.name,
        pr.team, pr.rank, pr.skills, pr.progress_percent, pr.xp,
        op.dossier_visibility, op.show_skills, op.show_progress, op.show_rank
    FROM users u
    LEFT JOIN profile_data pr ON pr.user_id = u.id
    LEFT JOIN operative_privacy op ON op.user_id = u.id
    WHERE u.id != ?
      AND (op.dossier_visibility IS NULL OR op.dossier_visibility != 'classified')
      AND (op.allow_links IS NULL OR op.allow_links = 1)
      AND u.id NOT IN (
          SELECT CASE WHEN requester_id = ? THEN receiver_id ELSE requester_id END
          FROM operative_links
          WHERE (requester_id = ? OR receiver_id = ?)
            AND status IN ('pending', 'active')
      )
    ORDER BY pr.xp DESC
    LIMIT 20
");
$stmt->bind_param("iiii", $user_id, $user_id, $user_id, $user_id);
$stmt->execute();
$result = $stmt->get_result();
$stmt->close();

$suggestions = [];
while ($row = $result->fetch_assoc()) {
    $skills_raw = json_decode($row['skills'] ?? '[]', true);
    $progress = (int) ($row['progress_percent'] ?? 0);
    $their_team = $row['team'] ?? null;

    // Derive suggestion reason
    $reason = 'Highly ranked operative';
    if ($their_team === $my_team && abs($progress - $my_progress) <= 20) {
        $reason = 'Same unit · Similar progress';
    } elseif ($their_team === $my_team) {
        $reason = 'Same unit · Complementary skills';
    } elseif ($row['xp'] > 1000) {
        $reason = 'High rank · Cross-unit learning';
    } elseif ($progress < 10) {
        $reason = 'New operative · Welcome them';
    }

    // Check clearance
    $clearance = get_operative_clearance($conn, $user_id, (int)$row['id']);
    if ($clearance === 'blocked') continue;

    $is_partial = ($clearance === 'partial');

    $suggestions[] = [
        'id'               => (int) $row['id'],
        'display_name'     => $row['display_name'] ?? $row['name'] ?? 'OPERATIVE',
        'team'             => $their_team,
        'rank'             => ($row['show_rank'] && !$is_partial) ? ($row['rank'] ?? 'RECRUIT') : 'CLASSIFIED',
        'skills'           => (!$is_partial && $row['show_skills'] && is_array($skills_raw)) ? array_slice($skills_raw, 0, 3) : [],
        'progress_percent' => (!$is_partial && $row['show_progress']) ? $progress : null,
        'xp'               => (int) ($row['xp'] ?? 0),
        'link_status'      => 'not_connected',
        'suggestion_reason'=> $reason,
        'shared_allies'    => get_shared_allies_count($conn, $user_id, (int)$row['id']),
    ];
}

send_response(true, 'SUGGESTIONS_READY', ['suggestions' => $suggestions]);
?>
