<?php
http_response_code(200);
header('Content-Type: application/json');

echo json_encode([
    'DB_HOST' => getenv('DB_HOST') ?: $_ENV['DB_HOST'] ?? $_SERVER['DB_HOST'] ?? 'NOT SET',
    'DB_USER' => getenv('DB_USER') ?: $_ENV['DB_USER'] ?? $_SERVER['DB_USER'] ?? 'NOT SET',
    'DB_NAME' => getenv('DB_NAME') ?: $_ENV['DB_NAME'] ?? $_SERVER['DB_NAME'] ?? 'NOT SET',
    'DB_PORT' => getenv('DB_PORT') ?: $_ENV['DB_PORT'] ?? $_SERVER['DB_PORT'] ?? 'NOT SET',
    'APP_ENV' => getenv('APP_ENV') ?: $_ENV['APP_ENV'] ?? $_SERVER['APP_ENV'] ?? 'NOT SET',
    'MYSQL_SSL' => getenv('MYSQL_SSL') ?: $_ENV['MYSQL_SSL'] ?? $_SERVER['MYSQL_SSL'] ?? 'NOT SET',
    'secrets_exists' => file_exists('/etc/secrets/.env'),
    'secrets_content' => file_exists('/etc/secrets/.env') ? file_get_contents('/etc/secrets/.env') : 'NOT FOUND',
]);
exit(0);
