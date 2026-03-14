<?php
namespace CYVE\Repositories;

class UserRepository {
    private $conn;

    public function __construct($conn) {
        $this->conn = $conn;
    }

    public function findByIdentity($identity) {
        $stmt = $this->conn->prepare("SELECT id, username, display_name, password_hash as password, role, email FROM users WHERE email = ? OR username = ?");
        $stmt->bind_param("ss", $identity, $identity);
        $stmt->execute();
        $result = $stmt->get_result();
        return $result->fetch_assoc();
    }

    public function getProfileData($userId) {
        $stmt = $this->conn->prepare("SELECT profile_data FROM users WHERE id = ?");
        $stmt->bind_param("i", $userId);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows === 1) {
            $user = $result->fetch_assoc();
            $stmt->close();
            return $user['profile_data'] ? json_decode($user['profile_data'], true) : null;
        }
        $stmt->close();
        return false;
    }

    public function findById($userId) {
        $stmt = $this->conn->prepare("SELECT id, email, display_name as full_name, username, display_name, role, team FROM users WHERE id = ?");
        $stmt->bind_param("i", $userId);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows === 1) {
            $user = $result->fetch_assoc();
            $stmt->close();
            return $user;
        }
        $stmt->close();
        return null;
    }

    public function updateProfile($userId, $profileData) {
        $stmt = $this->conn->prepare("UPDATE users SET profile_data = ? WHERE id = ?");
        $stmt->bind_param("si", $profileData, $userId);
        $success = $stmt->execute();
        $stmt->close();
        return $success;
    }

    public function updateDisplayName($userId, $displayName) {
        $stmt = $this->conn->prepare("UPDATE users SET display_name = ? WHERE id = ?");
        $stmt->bind_param("si", $displayName, $userId);
        $success = $stmt->execute();
        $stmt->close();
        return $success;
    }

    public function findByEmail($email) {
        $stmt = $this->conn->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();
        $user = $result->fetch_assoc();
        $stmt->close();
        return $user;
    }

    public function createPasswordReset($userId, $token, $expiry) {
        $stmt = $this->conn->prepare("UPDATE users SET reset_token = ?, reset_expiry = ? WHERE id = ?");
        $stmt->bind_param("ssi", $token, $expiry, $userId);
        $success = $stmt->execute();
        $stmt->close();
        return $success;
    }

    public function findByValidResetToken($token) {
        $stmt = $this->conn->prepare("SELECT id FROM users WHERE reset_token = ? AND reset_expiry > NOW()");
        $stmt->bind_param("s", $token);
        $stmt->execute();
        $result = $stmt->get_result();
        $user = $result->fetch_assoc();
        $stmt->close();
        return $user;
    }

    public function resetPassword($userId, $passwordHash) {
        $stmt = $this->conn->prepare("UPDATE users SET password_hash = ?, reset_token = NULL, reset_expiry = NULL WHERE id = ?");
        $stmt->bind_param("si", $passwordHash, $userId);
        $success = $stmt->execute();
        $stmt->close();
        return $success;
    }

    public function exists($email, $username) {
        $stmt = $this->conn->prepare("SELECT id FROM users WHERE email = ? OR username = ?");
        $stmt->bind_param("ss", $email, $username);
        $stmt->execute();
        $result = $stmt->get_result();
        $exists = $result->num_rows > 0;
        $stmt->close();
        return $exists;
    }

    public function create($username, $email, $passwordHash, $fullName) {
        $stmt = $this->conn->prepare("INSERT INTO users (username, email, password_hash, display_name, role) VALUES (?, ?, ?, ?, 'operative')");
        $stmt->bind_param("ssss", $username, $email, $passwordHash, $fullName);
        $success = $stmt->execute();
        $insertId = $this->conn->insert_id;
        $stmt->close();
        return $success ? $insertId : false;
    }

    public function getLeaderboard() {
        $query = "
            SELECT 
                u.id, 
                u.username, 
                u.full_name,
                u.profile_data,
                r.steps as roadmap_steps,
                (SELECT COUNT(*) FROM events e WHERE e.created_by = u.id AND e.status = 'approved') as event_count
            FROM users u
            LEFT JOIN roadmaps r ON r.created_by = u.id
            WHERE u.role != 'admin'
        ";

        $result = $this->conn->query($query);
        $leaderboard = [];

        while ($row = $result->fetch_assoc()) {
            $score = 0;
            
            if ($row['roadmap_steps']) {
                $steps = json_decode($row['roadmap_steps'], true);
                if (is_array($steps)) {
                    $completed_count = 0;
                    foreach ($steps as $step) {
                        if (isset($step['completed']) && $step['completed'] === true) {
                            $completed_count++;
                        }
                    }
                    $score += ($completed_count * 100);
                }
            }

            $score += ($row['event_count'] * 50);

            $team = 'unassigned';
            if ($row['profile_data']) {
                $profile = json_decode($row['profile_data'], true);
                if (isset($profile['preferredRole'])) {
                    $team = $profile['preferredRole'];
                }
            }

            $leaderboard[] = [
                'id' => $row['id'],
                'username' => $row['username'],
                'display_name' => $row['full_name'] ?: $row['username'],
                'score' => $score,
                'team' => $team,
                'missions' => intval($row['event_count'])
            ];
        }

        usort($leaderboard, function($a, $b) {
            return $b['score'] <=> $a['score'];
        });

        return array_slice($leaderboard, 0, 10);
    }
}
