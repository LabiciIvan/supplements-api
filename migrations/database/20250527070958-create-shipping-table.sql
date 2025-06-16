CREATE TABLE shipping (
  id INT PRIMARY KEY AUTO_INCREMENT,
  address VARCHAR(255),
  city VARCHAR(100),
  country VARCHAR(100),
  postal_code VARCHAR(20) NULL,
  shipping_method VARCHAR(255),
  shipping_cost DECIMAL(10, 2),
  FOREIGN KEY (shipping_method) REFERENCES shipping_methods(name)
);