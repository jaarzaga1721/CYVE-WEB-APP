<?php
namespace CYVE\Tests;

use PHPUnit\Framework\TestCase as BaseTestCase;
use mysqli;

if (!function_exists('log_activity')) {
    function log_activity($user_id, $action_type, $description = '') {}
}
if (!function_exists('log_admin_activity')) {
    function log_admin_activity($admin_id, $action, $target_user = null) {}
}

abstract class TestCase extends BaseTestCase {
    protected $conn;

    protected function setUp(): void {
        parent::setUp();
        
        // Use environment variables from testing or dummy credentials for now.
        // In a real environment we'd connect to a test-specific DB.
        // For the sake of this mock setup, we will mock the connection using PHPUnit's mock builder.
        
        $this->conn = $this->createMock(mysqli::class);
    }

    protected function tearDown(): void {
        parent::tearDown();
        $this->conn = null;
    }
}
