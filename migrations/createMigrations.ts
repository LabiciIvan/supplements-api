const fs = require('fs');
var path = require('path');

const fileExecuted = process.argv[1];
const migrationName = process.argv[2];

if (!migrationName) {
  console.error('Migration file name is missing. \nUsage: node createMigrations.js <migration-name>.');
  process.exit(1);
}

const isValidMigrationName = /^[a-zA-Z0-9-]+$/.test(migrationName);

if (!isValidMigrationName) {
  console.error('Migration name can only contain letters, numbers, and hypens.');
  process.exit(1);
}

const timestamp = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14);

const fileName = `${timestamp}-${migrationName}.sql`;

if (fs.existsSync(path.join(__dirname, fileName))) {
  console.error(`Migration file ${fileName} already exists.`);
  process.exit(1);
}

fs.writeFileSync(path.join(__dirname, fileName), '', { encoding: 'utf8' });

console.log(`Migration file ${fileName} created successfully.`);