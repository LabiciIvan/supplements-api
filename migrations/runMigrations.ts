import DB from '../core/database';
import fs from 'fs';
import path from 'path';

const directory = process.argv[2];
const migrationFile = process.argv[3];

if (!directory) {
  console.error('❌ Unknown directory. Migrations can\'t run from an unspecified directory.');
  process.exit(1);
}

// Build the full path if a single file is passed
const isSingleFile = migrationFile && migrationFile.endsWith('.sql');
const readFrom = isSingleFile ? path.resolve(directory, migrationFile) : path.resolve(directory);

// Check if file exists when a specific file is provided
if (isSingleFile && !fs.existsSync(readFrom)) {
  console.error(`❌ Migration file not found: ${readFrom}`);
  process.exit(1);
}



// Get migration files
const migrationFiles: string[] = [];

if (isSingleFile) {
  migrationFiles.push(readFrom);
} else {
  const dirContents = fs.readdirSync(readFrom, { withFileTypes: true });

  for (const file of dirContents) {
    if (file.isFile() && file.name.endsWith('.sql')) {
      migrationFiles.push(path.join(readFrom, file.name));
    }
  }
}


if (migrationFiles.length === 0) {
  console.log('⚠️ No .sql migration files found.');
  process.exit(0);
}

// Execute each migration
try {
  (async () => {
    await (async () => {
      for (const filePath of migrationFiles) {
        const sql = fs.readFileSync(filePath, 'utf8');
        console.log(`📦 Running migration: ${filePath}`);
        await DB.query(sql);
      }
    })();

    console.log('✅ All migrations executed successfully.');
    process.exit(0);
  })();

} catch (error: any) {
  console.error('❌ Error running migrations:', error);
  process.exit(1);
}
