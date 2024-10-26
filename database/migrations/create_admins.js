const Blueprint = require('../../libs/Service/Blueprint');
const DatabaseConnection = require('../database');

async function up() {
    const blueprint = new Blueprint();
    const tableName = 'admins';
    const db = new DatabaseConnection();

    blueprint.id();
    blueprint.string('email');
    blueprint.string('username');
    blueprint.string('password');
    blueprint.timestamp();

    const columns = blueprint.getColumns();

    try {
        await db.runQuery(`DROP TABLE IF EXISTS ${tableName};`);
        await db.runQuery(`CREATE TABLE ${tableName} (${columns});`);
        console.log(`Table ${tableName} created successfully.`);
    } catch (err) {
        console.error(`Error creating table ${tableName}:`, err);
    } finally {
        db.close();
    }
}

up();