ALTER TABLE operative_privacy MODIFY COLUMN dossier_visibility ENUM('public', 'unit_only', 'allies_only', 'classified') DEFAULT 'public';
