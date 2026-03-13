<?php
namespace CYVE\Repositories;

class EventRepository {
    private $conn;

    public function __construct($conn) {
        $this->conn = $conn;
    }

    public function getByUserId($userId) {
        $stmt = $this->conn->prepare("SELECT id, title, description, event_date, location, status FROM events WHERE created_by = ? ORDER BY event_date ASC");
        $stmt->bind_param("i", $userId);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $events = [];
        while ($row = $result->fetch_assoc()) {
            $events[] = $row;
        }
        return $events;
    }

    public function create($userId, $title, $description, $eventDate, $location) {
        $stmt = $this->conn->prepare("INSERT INTO events (title, description, event_date, location, created_by) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("ssssi", $title, $description, $eventDate, $location, $userId);
        $success = $stmt->execute();
        $insertId = $this->conn->insert_id;
        $stmt->close();
        return $success ? $insertId : false;
    }

    public function delete($eventId, $userId) {
        $stmt = $this->conn->prepare("DELETE FROM events WHERE id = ? AND created_by = ?");
        $stmt->bind_param("ii", $eventId, $userId);
        $success = $stmt->execute();
        $stmt->close();
        return $success;
    }
}
