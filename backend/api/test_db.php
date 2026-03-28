<?php
http_response_code(200);
header('Content-Type: application/json');

echo json_encode([
    'DB_HOST' => getenv('DB_HOST'),
    'DB_USER' => getenv('DB_USER'),
    'DB_NAME' => getenv('DB_NAME'),
    'DB_PORT' => getenv('DB_PORT'),
    'DB_PASS_SET' => !empty(getenv('DB_PASS')),
    'APP_ENV' => getenv('APP_ENV'),
    'MYSQL_SSL' => getenv('MYSQL_SSL'),
]);
exit(0);
