<?php
/**
 * Standardized API response utility
 */
function send_response($success, $message, $data = [], $code = 200)
{
    header("Content-Type: application/json");
    http_response_code($code);
    
    $response = array_merge([
        'success' => $success,
        'message' => $message,
        'timestamp' => time(),
        'request_id' => uniqid('req_')
    ], $data);
    
    echo json_encode($response);
    exit();
}
?>
