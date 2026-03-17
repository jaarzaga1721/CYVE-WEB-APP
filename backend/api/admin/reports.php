<?php
// STEP 1: CORS always comes first — before everything
require_once __DIR__ . '/../cors.php';

// STEP 2: Auth check comes AFTER cors (this fixes the 401 errors)
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['error' => 'Unauthorized', 'code' => 401]);
    http_response_code(401);
    exit();
}

require_once '../middleware.php';

// Feature-04: Report Generation (Admin Facing)
if (!isset($_SESSION['user_id'])) {
    send_response(false, 'Unauthorized. Please log in.', [], 401);
}
require_admin();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $reports = [];

    // 1. Total users per team
    $res = $conn->query("SELECT team, COUNT(*) as total FROM users GROUP BY team");
    $reports['users_per_team'] = $res->fetch_all(MYSQLI_ASSOC);

    // 2. Average roadmap progress per team
    $res = $conn->query("SELECT team, AVG(roadmap_progress) as avg_progress FROM users GROUP BY team");
    $reports['avg_progress'] = $res->fetch_all(MYSQLI_ASSOC);

    // 3. Missions completed per week
    $res = $conn->query("
        SELECT WEEK(completed_at) as week, COUNT(*) as total_completed 
        FROM missions 
        WHERE status = 'completed' AND completed_at IS NOT NULL
        GROUP BY WEEK(completed_at)
    ");
    $reports['missions_per_week'] = $res->fetch_all(MYSQLI_ASSOC);

    // 4. Most active users (by activity log count)
    $res = $conn->query("
        SELECT u.display_name, u.team, COUNT(a.id) as action_count 
        FROM users u 
        LEFT JOIN activity_logs a ON u.id = a.user_id 
        GROUP BY u.id 
        ORDER BY action_count DESC 
        LIMIT 10
    ");
    $reports['most_active'] = $res->fetch_all(MYSQLI_ASSOC);

    // 5. Users by rank
    $res = $conn->query("
        SELECT 
            CASE 
                WHEN roadmap_progress = 0 THEN 'Recruit'
                WHEN roadmap_progress < 25 THEN 'Trainee'
                WHEN roadmap_progress < 50 THEN 'Operative'
                WHEN roadmap_progress < 75 THEN 'Specialist'
                WHEN roadmap_progress < 100 THEN 'Expert'
                ELSE 'Handler'
            END as calculated_rank,
            COUNT(*) as total
        FROM users
        GROUP BY calculated_rank
    ");
    $reports['users_by_rank'] = $res->fetch_all(MYSQLI_ASSOC);

    send_response(true, 'Reports successfully compiled.', ['reports' => $reports]);
} else {
    send_response(false, 'Method not allowed.', [], 405);
}
?>
