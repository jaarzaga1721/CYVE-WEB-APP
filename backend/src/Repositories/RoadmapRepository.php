<?php
namespace CYVE\Repositories;

class RoadmapRepository {
    private $conn;

    public function __construct($conn) {
        $this->conn = $conn;
    }

    public function getByUserId($userId) {
        $stmt = $this->conn->prepare("SELECT steps FROM roadmaps WHERE created_by = ? ORDER BY created_at DESC LIMIT 1");
        $stmt->bind_param("i", $userId);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows === 1) {
            $row = $result->fetch_assoc();
            $stmt->close();
            return json_decode($row['steps'], true);
        }
        
        $stmt->close();
        return null;
    }

    public function save($userId, $title, $stepsArray) {
        $steps_json = json_encode($stepsArray);
        
        $check_stmt = $this->conn->prepare("SELECT id FROM roadmaps WHERE created_by = ? LIMIT 1");
        $check_stmt->bind_param("i", $userId);
        $check_stmt->execute();
        $check_result = $check_stmt->get_result();
        $exists = $check_result->num_rows > 0;
        $check_stmt->close();

        if ($exists) {
            $stmt = $this->conn->prepare("UPDATE roadmaps SET steps = ?, title = ? WHERE created_by = ?");
            $stmt->bind_param("ssi", $steps_json, $title, $userId);
        } else {
            $stmt = $this->conn->prepare("INSERT INTO roadmaps (steps, title, created_by) VALUES (?, ?, ?)");
            $stmt->bind_param("ssi", $steps_json, $title, $userId);
        }

        $success = $stmt->execute();
        $stmt->close();
        return $success;
    }
}
?>
