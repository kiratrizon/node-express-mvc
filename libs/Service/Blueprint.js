class Blueprint {
    constructor() {
        this.columns = [];
    }

    id() {
        const idDefinition = process.env.DATABASE === 'sqlite'
            ? 'INTEGER PRIMARY KEY AUTOINCREMENT'
            : 'INT AUTO_INCREMENT PRIMARY KEY';

        this.columns.push({ name: 'id', type: idDefinition });
    }

    string(name, length = 255) {
        this.columns.push({ name, type: `VARCHAR(${length})` });
    }

    text(name) {
        this.columns.push({ name, type: 'TEXT' });
    }

    integer(name) {
        this.columns.push({ name, type: 'INTEGER' });
    }

    float(name) {
        this.columns.push({ name, type: 'FLOAT' });
    }

    double(name) {
        this.columns.push({ name, type: 'DOUBLE' });
    }

    boolean(name) {
        this.columns.push({ name, type: 'BOOLEAN' });
    }

    date(name) {
        this.columns.push({ name, type: 'DATE' });
    }

    timestamp() {
        const createdAt = process.env.DATABASE === 'sqlite'
            ? 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP'
            : 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP';
        const updatedAt = process.env.DATABASE === 'sqlite'
            ? 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP'
            : 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP';

        this.columns.push({ name: 'created_at', type: createdAt });
        this.columns.push({ name: 'updated_at', type: updatedAt });
    }

    getColumns() {
        return this.columns.map(col => `${col.name} ${col.type}`).join(', ');
    }
}

module.exports = Blueprint;
