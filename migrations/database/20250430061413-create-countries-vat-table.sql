CREATE TABLE countries_vat (
  id INT AUTO_INCREMENT PRIMARY KEY,
  country VARCHAR(100) NOT NULL,
  vat DECIMAL(5,2) NOT NULL,
  year YEAR NOT NULL,
  currency VARCHAR(100),
  currency_symbol VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  UNIQUE KEY unique_country_year (country, year)
);