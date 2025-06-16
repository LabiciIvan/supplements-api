CREATE TABLE orders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  previous_status ENUM('pending', 'confirmed', 'shipped', 'delivered', 'cancelled') NULL DEFAULT NULL,
  total DECIMAL(10, 2),
  user_id INT,
  user_email VARCHAR(255) NOT NULL,
  status_id INT,
  shipping_id INT,
  country_vat_id INT,

  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (status_id) REFERENCES order_status(id),
  FOREIGN KEY (shipping_id) REFERENCES shipping(id),
  FOREIGN KEY (country_vat_id) REFERENCES countries_vat(id)
);