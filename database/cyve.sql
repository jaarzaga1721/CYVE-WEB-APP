-- Database: cyve
-- Description: Database schema for CYVE cybersecurity platform - Final Compliance Version

CREATE DATABASE IF NOT EXISTS cyve;
USE cyve;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS audit_log;
DROP TABLE IF EXISTS notes;
DROP TABLE IF EXISTS roadmaps;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS missions;
DROP TABLE IF EXISTS roadmap_progress;
DROP TABLE IF EXISTS user_skills;
DROP TABLE IF EXISTS user_certifications;
DROP TABLE IF EXISTS team_change_requests;
DROP TABLE IF EXISTS activity_logs;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS admin_logs;

SET FOREIGN_KEY_CHECKS = 1;

-- Users (main entity)
CREATE TABLE users (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  display_name     VARCHAR(100),
  username         VARCHAR(50) UNIQUE NOT NULL,
  email            VARCHAR(100) UNIQUE NOT NULL,
  password_hash    VARCHAR(255) NOT NULL,
  role             ENUM('admin','operative') DEFAULT 'operative',
  team             ENUM('red','blue','purple','unassigned') DEFAULT 'unassigned',
  profile_data     JSON DEFAULT NULL,
  roadmap_progress INT DEFAULT 0,
  rank             ENUM('Recruit','Trainee','Operative','Specialist','Expert','Handler') DEFAULT 'Recruit',
  created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Missions/Tasks
CREATE TABLE missions (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  user_id      INT NOT NULL,
  title        VARCHAR(255) NOT NULL,
  description  TEXT,
  notes        TEXT,
  priority     ENUM('low','medium','high') DEFAULT 'medium',
  status       ENUM('pending','completed','overdue') DEFAULT 'pending',
  due_date     DATE NOT NULL,
  linked_step  INT,
  completed_at TIMESTAMP NULL,
  is_deleted   BOOLEAN DEFAULT FALSE,
  deleted_at   TIMESTAMP NULL,
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Active Missions View (Feature-06)
CREATE OR REPLACE VIEW active_missions AS
SELECT * FROM missions WHERE is_deleted = FALSE;

-- Roadmap Steps Progress
CREATE TABLE roadmap_progress (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  user_id     INT NOT NULL,
  team        ENUM('red','blue','purple') NOT NULL,
  step_number INT NOT NULL,
  step_name   VARCHAR(255),
  status      ENUM('locked','active','completed') DEFAULT 'locked',
  completed_at TIMESTAMP NULL,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Skills
CREATE TABLE user_skills (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  user_id    INT NOT NULL,
  skill_name VARCHAR(100) NOT NULL,
  is_verified BOOLEAN DEFAULT FALSE,
  verified_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Certifications
CREATE TABLE user_certifications (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  user_id     INT NOT NULL,
  cert_name   VARCHAR(255) NOT NULL,
  difficulty  ENUM('beginner','intermediate','advanced'),
  issued_date DATE,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Team Change Requests (Feature-03)
CREATE TABLE team_change_requests (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  user_id        INT NOT NULL,
  current_team   ENUM('red','blue','purple','unassigned') NOT NULL,
  requested_team ENUM('red','blue','purple') NOT NULL,
  reason         TEXT,
  status         ENUM('pending','approved','rejected') DEFAULT 'pending',
  reviewed_by    INT,
  review_note    TEXT,
  created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  reviewed_at    TIMESTAMP NULL,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (reviewed_by) REFERENCES users(id)
);

-- Activity Logs (Feature-02)
CREATE TABLE activity_logs (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  user_id     INT NOT NULL,
  action_type ENUM(
    'login', 'logout', 'signup',
    'roadmap_step_complete', 'mission_created',
    'mission_completed', 'team_joined', 'team_changed',
    'profile_updated', 'skill_added', 'cert_added'
  ) NOT NULL,
  description VARCHAR(500),
  ip_address  VARCHAR(45),
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Notifications (Feature-05)
CREATE TABLE notifications (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  user_id    INT NOT NULL,
  type       ENUM(
    'mission_due', 'mission_overdue',
    'team_approved', 'team_rejected',
    'admin_message', 'rank_up',
    'link_request', 'link_accepted'
  ) NOT NULL,
  title      VARCHAR(255) NOT NULL,
  message    TEXT NOT NULL,
  is_read    BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Admin Logs (Feature-01)
CREATE TABLE admin_logs (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  admin_id    INT NOT NULL,
  action      VARCHAR(255) NOT NULL,
  target_user INT,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (admin_id) REFERENCES users(id)
);

-- Insert sample data
INSERT INTO users (username, email, password_hash, role, display_name, team) VALUES
('cyve_admin', 'admin@cyve.com', '$2y$10$iM3Fm/oG4Q18W6r.fPZ98uiHwSThf/IfO/BqJqYQEQl1oE.a7T7cO', 'admin', 'Administrator', 'unassigned'),
('red_operative', 'red@cyve.com', '$2y$10$w81o96.4.Z22vJ7nK0aNquL3sS195F9N8d5o2/z.xU4pT/vB33wGq', 'operative', 'Red Operative', 'red'),
('blue_operative', 'blue@cyve.com', '$2y$10$pU2uM3QGk.Z3I7B6L9rK2.bFq.Q3H4nI1H7BvF/c9rM1nI/U/O', 'operative', 'Blue Operative', 'blue'),
('purple_operative', 'purple@cyve.com', '$2y$10$yB3n9I1b/V7nM4A8rB3qI.pP6A8q1b9vN3iM1O1I2.uJ.tP9E1fHq', 'operative', 'Purple Operative', 'purple');