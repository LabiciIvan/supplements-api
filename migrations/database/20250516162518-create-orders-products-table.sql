CREATE TABLE orders_products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  quantity INT,
  base_price DECIMAL(10,2),
  vat_applied DECIMAL(5,2),
  vat_value DECIMAL(10,2),
  total_price DECIMAL(10,2),
  order_id INT,
  product_id INT,

  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);