<?php
namespace CYVE\Repositories;

class EventRepository {
    private $conn;

    public function __construct($conn) {
        $this->conn = $conn;
    }

    public function getByUserId($userId) {
        $stmt = $this->conn->prepare("SELECT id, title, description, due_date as event_date, notes as location, IF(status='completed', 'approved', 'pending') as status FROM active_missions WHERE user_id = ? ORDER BY due_date ASC");
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
        $stmt = $this->conn->prepare("INSERT INTO missions (title, description, due_date, notes, user_id) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("ssssi", $title, $description, $eventDate, $location, $userId);
        $success = $stmt->execute();
        $insertId = $this->conn->insert_id;
        $stmt->close();
        if ($success) {
            \log_activity($userId, 'mission_created', "Deployed new mission: $title");
        }
        return $success ? $insertId : false;
    }

    public function delete($eventId, $userId) {
        $stmt = $this->conn->prepare("UPDATE missions SET is_deleted = TRUE, deleted_at = NOW() WHERE id = ? AND user_id = ?");
        $stmt->bind_param("ii", $eventId, $userId);
        $success = $stmt->execute();
        $stmt->close();
        if ($success) {
            \log_activity($userId, 'mission_deleted', "Soft-deleted mission archive ID: $eventId");
        }
        return $success;
    }

    public function restore($eventId, $userId) {
        $stmt = $this->conn->prepare("UPDATE missions SET is_deleted = FALSE, deleted_at = NULL WHERE id = ? AND user_id = ?");
        $stmt->bind_param("ii", $eventId, $userId);
        $success = $stmt->execute();
        $stmt->close();
        if ($success) {
            \log_activity($userId, 'mission_restored', "Restored mission archive ID: $eventId");
        }
        return $success;
    }

    public function permanentDelete() {
        // Admin only, older than 30 days
        $stmt = $this->conn->prepare("DELETE FROM missions WHERE is_deleted = TRUE AND deleted_at < DATE_SUB(NOW(), INTERVAL 30 DAY)");
        $success = $stmt->execute();
        $stmt->close();
        return $success;
    }
}
