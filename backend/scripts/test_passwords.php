<?php
$hashes = [
    'admin' => '$2y$10$iM3Fm/oG4Q18W6r.fPZ98uiHwSThf/IfO/BqJqYQEQl1oE.a7T7cO',
    'red' => '$2y$10$w81o96.4.Z22vJ7nK0aNquL3sS195F9N8d5o2/z.xU4pT/vB33wGq',
    'blue' => '$2y$10$pU2uM3QGk.Z3I7B6L9rK2.bFq.Q3H4nI1H7BvF/c9rM1nI/U/O',
    'purple' => '$2y$10$yB3n9I1b/V7nM4A8rB3qI.pP6A8q1b9vN3iM1O1I2.uJ.tP9E1fHq'
];

$passwords = [
    'admin', 'password', '123456', 'admin123', 'password123', 'admin@123', 'cyve', 'CYVE', 'cyve123',
    'red', 'blue', 'purple', 'operative', 'root', 'toor', 'Admin123!', 'Cyve123!', '12345678', '123456789'
];

foreach ($hashes as $user => $hash) {
    echo "Testing $user...\n";
    foreach ($passwords as $pwd) {
        if (password_verify($pwd, $hash)) {
            echo "FOUND: $user -> $pwd\n";
            continue 2;
        }
    }
    echo "NOT FOUND for $user\n";
}
