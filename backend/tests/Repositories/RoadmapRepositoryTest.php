<?php
namespace CYVE\Tests\Repositories;

use CYVE\Tests\TestCase;
use CYVE\Repositories\RoadmapRepository;
use mysqli_stmt;
use mysqli_result;

class RoadmapRepositoryTest extends TestCase {
    private RoadmapRepository $repository;

    protected function setUp(): void {
        parent::setUp();
        $this->repository = new RoadmapRepository($this->conn);
    }

    public function testGetByUserIdReturnsDecodedJsonSteps() {
        $mockStmt = $this->createMock(mysqli_stmt::class);
        
        $jsonSteps = json_encode([['id' => '1', 'completed' => true]]);
        
        $mockResult = new class($jsonSteps) {
            public $num_rows = 1;
            private $steps;
            public function __construct($steps) {
                $this->steps = $steps;
            }
            public function fetch_assoc() {
                return ['steps' => $this->steps];
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

        $mockStmt->expects($this->once())
                 ->method('close');

        $this->conn->expects($this->once())
                   ->method('prepare')
                   ->willReturn($mockStmt);

        $result = $this->repository->getByUserId(1);
        
        $this->assertIsArray($result);
        $this->assertCount(1, $result);
        $this->assertTrue($result[0]['completed']);
    }

    public function testGetByUserIdReturnsNullWhenNoRoadmapExists() {
        $mockStmt = $this->createMock(mysqli_stmt::class);
        $mockResult = new class {
            public $num_rows = 0;
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
                 
        $mockStmt->expects($this->once())
                 ->method('close');

        $this->conn->expects($this->once())
                   ->method('prepare')
                   ->willReturn($mockStmt);

        $result = $this->repository->getByUserId(1);
        
        $this->assertNull($result);
    }
}
