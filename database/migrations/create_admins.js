const Migrator = require('../../libs/Service/Migrator');

const m = new Migrator();
const tableName = 'admins';

// Check if database type is MySQL or SQLite
m.addSql(`DROP TABLE IF EXISTS ${tableName}`);
m.addSql(`CREATE TABLE IF NOT EXISTS ${tableName} (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);`);

(async () => {
    try {
        console.log('Starting migration...');
        await m.migrate();
        console.log('Migration completed.');
    } catch (error) {
        console.error('Migration failed:', error);
    }
})();
