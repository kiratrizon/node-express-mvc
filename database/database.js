const mysql = require('mysql2');
const sqlite3 = require('sqlite3');
const path = require('path');
require('dotenv').config();


class DatabaseConnection {
    constructor() {
        this.debugger = false;
        this.connection = null;
    }

    openConnection() {
        const isSQLite = process.env.DATABASE === 'sqlite';

        if (isSQLite) {
            const dbPath = path.join(__dirname, '../database', 'database.sqlite');
            this.connection = new sqlite3.Database(dbPath, (err) => {
                if (err) {
                    console.error('Error connecting to SQLite database:', err.message);
                    process.exit(1);
                } else {
                    console.log('Connected to SQLite database');
                }
            });
        } else {
            this.connection = mysql.createConnection({
                host: process.env.MYSQL_ADDON_HOST || 'localhost',
                user: process.env.MYSQL_ADDON_USER || 'root',
                password: process.env.MYSQL_ADDON_PASSWORD || '',
                database: process.env.MYSQL_ADDON_DB || 'express',
                port: process.env.MYSQL_ADDON_PORT || 3306
            });

            this.connection.connect(err => {
                if (err) {
                    console.error('Error connecting to MySQL database:', err.message);
                    process.exit(1);
                } else {
                    console.log('Connected to MySQL database');
                }
            });
        }
    }

    runQuery(query, params = []) {
        this.openConnection();
        const isSQLite = process.env.DATABASE === 'sqlite';

        return new Promise((resolve, reject) => {
            if (isSQLite) {
                if (query.trim().toLowerCase().startsWith("select")) {
                    this.connection.all(query, params, (err, rows) => {
                        if (err) {
                            return reject(err);
                        }
                        resolve(rows);
                    });
                } else {
                    this.connection.run(query, params, function (err) {
                        if (err) {
                            return reject(err);
                        }
                        resolve({ lastID: this.lastID, changes: this.changes });
                    });
                }
            } else {
                this.connection.query(query, params, (err, results) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(results);
                });
            }
        });
    }

    close() {
        if (!this.connection) return;

        if (process.env.DATABASE === 'sqlite') {
            this.connection.close((err) => {
                if (err) {
                    console.error('Error closing the SQLite connection:', err.message);
                } else {
                    console.log('SQLite connection closed.');
                }
            });
        } else {
            this.connection.end((err) => {
                if (err) {
                    console.error('Error closing the MySQL connection:', err.message);
                } else {
                    console.log('MySQL connection closed.');
                }
            });
        }
    }
}

module.exports = DatabaseConnection;
