<?php
// STEP 1: CORS always comes first — before everything
require_once __DIR__ . '/cors.php';

require_once 'middleware.php';
send_response(true, "CYVE Backend is reachable!");
?>
