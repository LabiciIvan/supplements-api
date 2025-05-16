# Interacting with the Database via Terminal (Docker)

This directory contains SQL migration files for making adjustments to the database schema, such as adding or modifying columns, without requiring a full database recreation.

## Accessing the Database with Docker

To interact with the database using Docker, you can use the following commands:

1. **Access the `supplements-api` container**:
  Run the following command to open a terminal session inside the `supplements-api` container:
  ```bash
  docker-compose exec -it supplements-api /bin/bash
  ```
  This provides access to the `migrations` folder, allowing you to manage and execute migration scripts.

2. **Running Migrations**:  
  Once inside the container, you can apply a migration using the `mysql` command:  
  ```bash
  mysql -h <host> -u<user> -p<password> supplements_db < "migration_file.sql"
  ```
  Replace `<host>`, `<user>`, `<password>`, and `"migration_file.sql"` with the appropriate values for your setup.

## Running Migrations for Development

For development purposes, you can also run migrations directly from your host machine using the following command:
```bash
docker exec -i <container_name> mysql -h <host> -u<user> -p<password> supplements_db < "migration_file.sql"
```

## Purpose of the `migrations/sql` Directory

This directory is specifically for SQL migration files that adjust the database schema.

Typical use cases include:
- Adding new columns to existing tables.
- Modifying column types or constraints.
- Dropping or renaming columns.

These migrations ensure that schema changes can be applied incrementally without requiring a full database reset, making the process efficient and non-disruptive.


### 🛠️ Running Migrations

To execute database migrations, use the `runMigrations.ts` script via `ts-node`.

NOTE: you must be inside the supplements-api container, see the step 1.

#### 📌 Usage

 You must be **inside the `migrations/` directory** when running the command.
- `<directory>` should be the folder where your `.sql` migrations are stored — commonly `adjustments`, `database`, or `seed`.
- Optionally, you can specify a specific `.sql` file to run **just one migration**.

#### ✅ Examples

Run **all** `.sql` files from the `seed/` directory:

```bash
npx ts-node runMigrations.ts seed
```

Run a **specific** migration file:

```bash
npx ts-node runMigrations.ts seed 20250515105914-seed-users-roles-table.sql
```