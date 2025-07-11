CREATE TABLE password_reset (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  token TEXT NOT NULL,
  reset ENUM('Y', 'N') DEFAULT 'N',
  valid ENUM('Y', 'N') DEFAULT 'Y',
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
)