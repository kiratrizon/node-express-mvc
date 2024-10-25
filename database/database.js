const mysql = require('mysql2');

class DatabaseConnection {
    constructor() {
        this.debugger = false;
    }

    openConnection() {
        this.connection = mysql.createConnection({
            host: 'b1ki8scs0geezffy22p1-mysql.services.clever-cloud.com',
            user: 'ualy6i6qmmmcyh7h',
            password: 'MlxVnqezy1jZ5uz5X1LI',
            database: 'b1ki8scs0geezffy22p1',
            port: 3306
        });

        // Connect to the MySQL database
        this.connection.connect(err => {
            if (err) {
                console.error('Error connecting to MySQL database:', err.message);
                process.exit(1);
            } else {
                console.log('Connected to MySQL database');
            }
        });
    }

    // Method to run a query
    async runQuery(query, params = []) {
        this.openConnection();
        return new Promise((resolve, reject) => {
            this.connection.query(query, params, (err, results) => {
                if (err) {
                    return reject(err);
                }
                resolve(results);
            });
        });
    }

    close() {
        this.connection.end(err => {
            if (err) {
                console.error('Error closing the MySQL connection:', err.message);
            } else {
                console.log('MySQL connection closed.');
            }
        });
    }
}

module.exports = DatabaseConnection;
