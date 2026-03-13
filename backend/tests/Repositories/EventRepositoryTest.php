<?php
namespace CYVE\Tests\Repositories;

use CYVE\Tests\TestCase;
use CYVE\Repositories\EventRepository;
use mysqli_stmt;
use mysqli_result;

class EventRepositoryTest extends TestCase {
    private EventRepository $repository;

    protected function setUp(): void {
        parent::setUp();
        $this->repository = new EventRepository($this->conn);
    }

    public function testGetByUserIdReturnsEventsArray() {
        $mockStmt = $this->createMock(mysqli_stmt::class);
        
        $mockEvents = [
            ['id' => 1, 'title' => 'Test Event', 'description' => 'Test', 'event_date' => '2024-12-01', 'location' => 'HQ', 'status' => 'approved']
        ];
        
        $mockResult = new class($mockEvents) {
            private $data;
            public function __construct($data) {
                $this->data = $data;
            }
            public function fetch_assoc() {
                if (empty($this->data)) return null;
                return array_shift($this->data);
            }
        };

        $mockStmt->expects($this->once())
                 ->method('bind_param')
                 ->with('i', 1);
                 
        $mockStmt->expects($this->once())
                 ->method('execute')
                 ->willReturn(true);
                 
        $mockStmt->expects($this->once())
                 ->method('get_result')
                 ->willReturn($mockResult);

        $this->conn->expects($this->once())
                   ->method('prepare')
                   ->willReturn($mockStmt);

        $result = $this->repository->getByUserId(1);
        
        $this->assertIsArray($result);
        $this->assertCount(1, $result);
        $this->assertEquals('Test Event', $result[0]['title']);
    }

    public function testDeleteReturnsTrueOnSuccess() {
        $mockStmt = $this->createMock(mysqli_stmt::class);

        $mockStmt->expects($this->once())
                 ->method('bind_param')
                 ->with('ii', 10, 1);
                 
        $mockStmt->expects($this->once())
                 ->method('execute')
                 ->willReturn(true);
                 
        $mockStmt->expects($this->once())
                 ->method('close');

        $this->conn->expects($this->once())
                   ->method('prepare')
                   ->willReturn($mockStmt);

        $result = $this->repository->delete(10, 1);
        
        $this->assertTrue($result);
    }
}
