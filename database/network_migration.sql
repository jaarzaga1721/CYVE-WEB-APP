-- CYVE Operative Network — Database Migration
-- Run this against the `cyve` database to enable the Operative Network feature.

-- ─────────────────────────────────────────────────────────────
-- Table: operative_links
-- Tracks connection states between operatives
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS operative_links (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  requester_id    INT NOT NULL,
  receiver_id     INT NOT NULL,
  status          ENUM('pending', 'active', 'terminated') DEFAULT 'pending',
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (requester_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (receiver_id)  REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_link (requester_id, receiver_id)
);

-- ─────────────────────────────────────────────────────────────
-- Table: operative_privacy
-- Per-user dossier visibility and privacy settings
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS operative_privacy (
  user_id              INT PRIMARY KEY,
  dossier_visibility   ENUM('public', 'unit_only', 'classified') DEFAULT 'public',
  show_progress        BOOLEAN DEFAULT TRUE,
  show_skills          BOOLEAN DEFAULT TRUE,
  show_rank            BOOLEAN DEFAULT TRUE,
  allow_links          BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ─────────────────────────────────────────────────────────────
-- Table: signal_feed
-- Activity events for the operative signal feed
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS signal_feed (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  user_id     INT NOT NULL,
  event_type  ENUM(
                'step_complete', 'mission_complete', 'team_joined',
                'cert_earned', 'skill_verified', 'rank_up',
                'link_established', 'ctf_joined'
              ) NOT NULL,
  event_data  JSON,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ─────────────────────────────────────────────────────────────
-- Seed default privacy settings for existing users
-- ─────────────────────────────────────────────────────────────
INSERT IGNORE INTO operative_privacy (user_id)
SELECT id FROM users;
