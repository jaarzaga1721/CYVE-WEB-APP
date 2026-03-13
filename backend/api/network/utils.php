<?php
/**
 * Operative Network Utilities
 * Centralized logging for signal feed events and intelligence helpers.
 */

/**
 * Log a signal event to the operative grid.
 */
function log_signal_event($conn, $user_id, $type, $data_array = []) {
    $event_data = json_encode($data_array);
    $stmt = $conn->prepare("INSERT INTO signal_feed (user_id, event_type, event_data) VALUES (?, ?, ?)");
    if ($stmt) {
        $stmt->bind_param("iss", $user_id, $type, $event_data);
        $stmt->execute();
        $stmt->close();
        return true;
    }
    return false;
}

/**
 * Get SQL fragment for mutual connection count between current user and target user.
 * Assumes 'u' is the alias for users table.
 */
function get_mutual_sql($current_user_id) {
    return "(
        SELECT COUNT(*)
        FROM operative_links l1
        JOIN operative_links l2 ON (
            (l2.requester_id = l1.requester_id AND l2.receiver_id = ?) OR
            (l2.receiver_id = l1.requester_id AND l2.requester_id = ?) OR
            (l2.requester_id = l1.receiver_id AND l2.receiver_id = ?) OR
            (l2.receiver_id = l1.receiver_id AND l2.requester_id = ?)
        )
        WHERE (l1.requester_id = $current_user_id OR l1.receiver_id = $current_user_id)
          AND l1.status = 'active'
          AND l2.status = 'active'
          AND (
            (l1.requester_id = ? AND l1.receiver_id != ?) OR
            (l1.receiver_id = ? AND l1.requester_id != ?)
          )
    )";
}
/* Note: The above SQL logic for mutuals can be simplified if we just count how many 
   'allies' of user A are also 'allies' of user B. */

function get_shared_allies_count($conn, $user_a, $user_b) {
    if ($user_a == $user_b) return 0;
    $stmt = $conn->prepare("
        SELECT COUNT(*) as shared_count FROM (
            SELECT CASE WHEN requester_id = ? THEN receiver_id ELSE requester_id END as ally_id
            FROM operative_links WHERE (requester_id = ? OR receiver_id = ?) AND status = 'active'
        ) allies_a
        JOIN (
            SELECT CASE WHEN requester_id = ? THEN receiver_id ELSE requester_id END as ally_id
            FROM operative_links WHERE (requester_id = ? OR receiver_id = ?) AND status = 'active'
        ) allies_b ON allies_a.ally_id = allies_b.ally_id
    ");
    $stmt->bind_param("iiiiii", $user_a, $user_a, $user_a, $user_b, $user_b, $user_b);
    $stmt->execute();
    $res = $stmt->get_result()->fetch_assoc();
    $stmt->close();
    return (int)($res['shared_count'] ?? 0);
}

/**
 * Determine the clearance level/access User A has to User B's dossier data.
 * Returns: 'full', 'partial' (basic scan), or 'blocked'
 */
function get_operative_clearance($conn, $viewer_id, $target_id) {
    if ($viewer_id == $target_id) return 'full';

    // Get target's privacy settings
    $stmt = $conn->prepare("SELECT dossier_visibility, allow_links FROM operative_privacy WHERE user_id = ?");
    $stmt->bind_param("i", $target_id);
    $stmt->execute();
    $privacy = $stmt->get_result()->fetch_assoc();
    $stmt->close();

    if (!$privacy) return 'full'; // Default if no settings exist

    $visibility = $privacy['dossier_visibility'];

    if ($visibility === 'classified') return 'blocked';

    if ($visibility === 'allies_only') {
        $check = $conn->prepare("SELECT COUNT(*) as is_ally FROM operative_links WHERE 
            ((requester_id = ? AND receiver_id = ?) OR (requester_id = ? AND receiver_id = ?))
            AND status = 'active'");
        $check->bind_param("iiii", $viewer_id, $target_id, $target_id, $viewer_id);
        $check->execute();
        $is_ally = $check->get_result()->fetch_assoc()['is_ally'];
        $check->close();
        return $is_ally ? 'full' : 'blocked';
    }

    if ($visibility === 'unit_only') {
        $stmt = $conn->prepare("
            SELECT (SELECT team FROM profile_data WHERE user_id = ?) as viewer_team,
                   (SELECT team FROM profile_data WHERE user_id = ?) as target_team
        ");
        $stmt->bind_param("ii", $viewer_id, $target_id);
        $stmt->execute();
        $teams = $stmt->get_result()->fetch_assoc();
        $stmt->close();
        
        if ($teams['viewer_team'] && $teams['viewer_team'] === $teams['target_team']) {
            return 'full';
        }
        return 'partial';
    }

    return 'full'; // 'public'
}
?>
