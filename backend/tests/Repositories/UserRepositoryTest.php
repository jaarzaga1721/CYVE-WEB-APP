<?php
namespace CYVE\Tests\Repositories;

use CYVE\Tests\TestCase;
use CYVE\Repositories\UserRepository;
use mysqli_stmt;
use mysqli_result;

class UserRepositoryTest extends TestCase {
    private UserRepository $repository;

    protected function setUp(): void {
        parent::setUp();
        $this->repository = new UserRepository($this->conn);
    }

    public function testExistsReturnsTrueWhenUserExists() {
        $mockStmt = $this->createMock(mysqli_stmt::class);
        $mockResult = new class {
            public $num_rows = 1;
        };

        $mockStmt->expects($this->once())
                 ->method('bind_param')
                 ->with('ss', 'test@cyve.com', 'testuser');
                 
        $mockStmt->expects($this->once())
                 ->method('execute')
                 ->willReturn(true);
                 
        $mockStmt->expects($this->once())
                 ->method('get_result')
                 ->willReturn($mockResult);
                 
        $mockStmt->expects($this->once())
                 ->method('close');

        $this->conn->expects($this->once())
                   ->method('prepare')
                   ->with("SELECT id FROM users WHERE email = ? OR username = ?")
                   ->willReturn($mockStmt);

        $result = $this->repository->exists('test@cyve.com', 'testuser');
        
        $this->assertTrue($result);
    }

    public function testExistsReturnsFalseWhenUserDoesNotExist() {
        $mockStmt = $this->createMock(mysqli_stmt::class);
        $mockResult = new class {
            public $num_rows = 0;
        };

        $mockStmt->method('bind_param')->willReturn(true);
        $mockStmt->method('execute')->willReturn(true);
        $mockStmt->method('get_result')->willReturn($mockResult);

        $this->conn->method('prepare')->willReturn($mockStmt);

        $result = $this->repository->exists('new@cyve.com', 'newuser');
        
        $this->assertFalse($result);
    }
}
