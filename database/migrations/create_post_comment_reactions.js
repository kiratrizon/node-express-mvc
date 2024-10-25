const Migrator = require('../../libs/Service/Migrator');

const m = new Migrator();
const tableName = 'post_comment_reactions';

m.addSql(`DROP TABLE IF EXISTS ${tableName}`);
m.addSql(`CREATE TABLE IF NOT EXISTS ${tableName} (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    comment_id INTEGER NOT NULL,
    type TINYINT NOT NULL,
    reaction TINYINT NOT NULL,
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
