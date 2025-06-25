-- Add a description column to the products table
ALTER TABLE products ADD COLUMN description TEXT NOT NULL AFTER name;