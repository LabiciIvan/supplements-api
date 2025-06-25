ALTER TABLE orders ADD COLUMN country_vat_id INT AFTER shipping_id;

ALTER TABLE orders ADD CONSTRAINT fk_country_vat FOREIGN_KEY (country_vat_id) REFERENCES countries_vat(id);