📦 Database Schema Documentation
This document describes the database schema for the application. The database is designed to handle users, products, orders, shipping, and authentication with proper relational integrity.

🗄️ Tables Overview
1️⃣ users
Stores user information.

Column	Type	Description
id	INT (PK)	Unique user identifier
username	VARCHAR	Username
email	VARCHAR	User email
password_hash	VARCHAR	Password hash
created_at	DATETIME	Account creation date
deleted	BOOLEAN	Flag for soft delete
deleted_at	DATETIME	Timestamp of deletion

🔗 Relationships:

1️⃣ user → many roles

1️⃣ user → many login_attempts

1️⃣ user → many logged_users

1️⃣ user → many orders

1️⃣ user → many products (via created_by)

2️⃣ roles
Defines user roles (admin, customer, etc).

Column	Type	Description
user_id	INT (FK)	References users.id
created_at	DATETIME	Role assigned date
updated_at	DATETIME	Role last updated
role	VARCHAR	Role name

3️⃣ login_attempts
Tracks user login attempts.

Column	Type	Description
id	INT (PK)	Unique ID
user_id	INT (FK)	References users.id
email	VARCHAR	Attempted email
ip_address	VARCHAR	IP address used
user_agent	VARCHAR	Browser/User Agent string
success	BOOLEAN	Whether attempt was successful
attempted_at	DATETIME	Timestamp of attempt

4️⃣ logged_users
Stores active user sessions.

Column	Type	Description
id	INT (PK)	Unique session ID
user_id	INT (FK)	References users.id
jwt_token	TEXT	JWT token issued
ip_address	VARCHAR	IP address of session
user_agent	VARCHAR	Browser/User Agent string
logged_in_at	DATETIME	Login timestamp
expires_at	DATETIME	Expiration timestamp

5️⃣ categories
Product categories.

Column	Type	Description
id	INT (PK)	Unique category ID
name	VARCHAR	Category name
created_at	DATETIME	Creation timestamp

6️⃣ products
Product details.

Column	Type	Description
id	INT (PK)	Unique product ID
created_at	DATETIME	Creation date
deleted	BOOLEAN	Soft delete flag
updated_at	DATETIME	Last update
name	VARCHAR	Product name
description	TEXT	Product description
price	DECIMAL	Product price
quantity	INT	Available quantity
category_id	INT (FK)	References categories.id
created_by	INT (FK)	References users.id

🔗 Relationships:

many products → 1️⃣ category

many products → many orders (via orders_products)

7️⃣ orders
Customer orders.

Column	Type	Description
id	INT (PK)	Unique order ID
created_at	DATETIME	Order date
updated_at	DATETIME	Last update
previous_status	VARCHAR	Previous order status
total	DECIMAL	Order total price
user_id	INT (FK)	References users.id
status_id	INT (FK)	References order_status.id
shipping_id	INT (FK)	References shipping.id

🔗 Relationships:

1️⃣ order → many order_products

1️⃣ order → 1️⃣ shipping

1️⃣ order → 1️⃣ order_status

8️⃣ orders_products
Many-to-many relation between orders and products.

Column	Type	Description
id	INT (PK)	Unique ID
quantity	INT	Quantity ordered
price_at_time	DECIMAL	Price at order time
order_id	INT (FK)	References orders.id
product_id	INT (FK)	References products.id

9️⃣ order_status
Possible statuses for orders.

Column	Type	Description
id	INT (PK)	Status ID
status	VARCHAR	Status description

🔟 shipping
Shipping details.

Column	Type	Description
id	INT (PK)	Unique shipping ID
address	VARCHAR	Address
city	VARCHAR	City
country	VARCHAR	Country
postalcode	VARCHAR	Postal code
shipping_method	VARCHAR	Method used
shipping_cost	DECIMAL	Cost of shipping

🔗 Entity Relationships
✅ One user → many orders, roles, login_attempts, logged_users
✅ One category → many products
✅ One order → many products (via orders_products)
✅ One order_status → many orders
✅ One shipping → many orders
✅ Many-to-Many: orders ↔️ products (via orders_products)

💡 Notes
✅ Soft deletes are implemented on users and products.

✅ Orders use a normalized status table for tracking state transitions.

✅ Login & security mechanisms are logged (via login_attempts and logged_users).

✅ Prices in orders_products are stored at time of order to maintain historical pricing.

