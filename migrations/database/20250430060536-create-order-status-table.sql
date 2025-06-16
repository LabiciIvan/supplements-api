CREATE TABLE order_status (
  id INT PRIMARY KEY AUTO_INCREMENT,
  status ENUM('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')
);