ALTER TABLE orders_products ADD COLUMN base_price DECIMAL(10,2) AFTER quantity;

ALTER TABLE orders_products ADD COLUMN vat_applied DECIMAL(10,2) AFTER base_price;

ALTER TABLE orders_products ADD COLUMN vat_value DECIMAL(10,2) AFTER vat_applied;

ALTER TABLE orders_products ADD COLUMN total_price DECIMAL(10,2) AFTER vat_value;