CREATE TABLE logged_users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  jwt_token TEXT NOT NULL,
  ip_address VARCHAR(45),
  user_agent TEXT,
  logged_in_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  expires_at DATETIME NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);