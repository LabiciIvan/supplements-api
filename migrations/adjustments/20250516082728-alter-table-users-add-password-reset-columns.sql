ALTER TABLE users ADD COLUMN password_reset_1 VARCHAR(255) DEFAULT NULL AFTER email;

ALTER TABLE users ADD COLUMN password_reset_2 VARCHAR(255) DEFAULT NULL AFTER password_reset_1;

ALTER TABLE users ADD COLUMN password_reset_3 VARCHAR(255) DEFAULT NULL AFTER password_reset_2;

ALTER TABLE users ADD COLUMN password_reset_4 VARCHAR(255) DEFAULT NULL AFTER password_reset_3;

ALTER TABLE users ADD COLUMN password_reset_date TIMESTAMP NULL DEFAULT NULL AFTER password_reset_4;
