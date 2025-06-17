-- Add roles for those users;
INSERT INTO roles (user_id, role) VALUES ((SELECT id FROM users WHERE email = 'bob@mail.com'), 'admin');

INSERT INTO roles (user_id, role) VALUES ((SELECT id FROM users WHERE email = 'mike@mail.com'), 'customer');