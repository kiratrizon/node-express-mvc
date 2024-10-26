const mysql = require('mysql2');
const Database = require('better-sqlite3');
const path = require('path');
require('dotenv').config();

class DatabaseConnection {
    constructor() {
        this.debugger = (process.env.DEBUGGER || 'false') === 'true';
        this.connection = null;
    }

    openConnection() {
        const isSQLite = process.env.DATABASE === 'sqlite';

        if (isSQLite) {
            const dbPath = path.join(__dirname, '../database', 'database.sqlite');
            this.connection = new Database(dbPath);
        } else {
            this.connection = mysql.createConnection({
                host: process.env.MYSQL_ADDON_HOST || 'localhost',
                user: process.env.MYSQL_ADDON_USER || 'root',
                password: process.env.MYSQL_ADDON_PASSWORD || '',
                database: process.env.MYSQL_ADDON_DB || 'express',
                port: process.env.MYSQL_ADDON_PORT || 3306
            });

            this.connection.connect((err) => {
                if (err) {
                    console.error('Error connecting to MySQL database:', err.message);
                    process.exit(1);
                } else {
                }
            });
        }
    }

    async runQuery(query, params = []) {
        this.openConnection();
        const isSQLite = process.env.DATABASE === 'sqlite';

        return new Promise((resolve, reject) => {
            try {
                if (isSQLite) {
                    const stmt = this.connection.prepare(query);
                    const isSelect = query.trim().toLowerCase().startsWith('select');
                    const result = isSelect ? stmt.all(params) : stmt.run(params);
                    resolve(result);
                } else {
                    this.connection.query(query, params, (err, results) => {
                        if (err) reject(err);
                        else resolve(results);
                    });
                }
            } catch (err) {
                reject(err);
            }
        });
    }

    close() {
        if (!this.connection) return;

        if (process.env.DATABASE === 'sqlite') {
            this.connection.close();
        } else {
            this.connection.end((err) => {
                if (err) {
                    console.error('Error closing the MySQL connection:', err.message);
                } else {
                }
            });
        }
    }
}

module.exports = DatabaseConnection;

process.on('exit', () => {
    const db = new DatabaseConnection();
    db.close();
});