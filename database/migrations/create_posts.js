const Blueprint = require('../../libs/Service/Blueprint');
const DatabaseConnection = require('../database');

async function up() {
    const blueprint = new Blueprint();
    const tableName = 'posts';
    const db = new DatabaseConnection();

    blueprint.id();
    blueprint.text('content');
    blueprint.boolean('status');
    blueprint.integer('poster');
    blueprint.integer('type');
    blueprint.timestamp();

    const columns = blueprint.getColumns();

    try {
        await db.runQuery(`CREATE TABLE ${tableName} (${columns});`);
        console.log(`Table ${tableName} created successfully.`);
    } catch (err) {
        console.error(`Error creating table ${tableName}:`, err);
    } finally {
        db.close();
    }
}

up();