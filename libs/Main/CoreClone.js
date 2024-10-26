const DatabaseConnection = require('../../database/database');
const GlobalFunctions = require('../Base/GlobalFunctions');

class Core extends GlobalFunctions {
    #values;
    constructor(tableName) {
        super();
        this.tableName = tableName;
        this.db = new DatabaseConnection();
        this.debug = this.db.debugger;
        this.#values = [];
    }

    async find(options) {
        let sql = `SELECT `;
        const conditions = options.conditions || {};
        const builtConditions = this.buildConditions(conditions);
        this.#values.push(...builtConditions.values);
        sql += `* FROM ${this.tableName} ${builtConditions.sql} LIMIT 1`.trim() + ";";

        if (this.debug) {
            console.log("SQL Query:", sql);
            console.log("Query Values:", this.#values);
        }

        try {
            const data = await this.db.runQuery(sql, this.#values);
            return data[0] ? data[0] : null; // Ensure it returns null if no data found
        } catch (error) {
            console.error("Error executing query:", error);
            throw error;
        } finally {
            this.db.close();
            this.#values = [];
        }
    }

    buildConditions(conditions = {}) {
        let sqlConditions = [];
        let values = [];

        Object.entries(conditions).forEach(([key, condition]) => {
            const [operator, conditionValue] = condition; // Destructure operator and value

            switch (operator.toUpperCase()) {
                case 'IS':
                    sqlConditions.push(`${key} IS ${conditionValue}`);
                    break;

                case 'IN':
                    const placeholders = conditionValue.map(() => '?').join(', ');
                    sqlConditions.push(`${key} IN (${placeholders})`);
                    values.push(...conditionValue); // Add the values to the array
                    break;

                case 'BETWEEN':
                    const [lowerBound, upperBound] = conditionValue;
                    sqlConditions.push(`${key} BETWEEN ? AND ?`);
                    values.push(lowerBound, upperBound);
                    break;

                case 'LIKE':
                case '=':
                case 'NOT LIKE':
                    sqlConditions.push(`${key} ${operator} ?`);
                    values.push(conditionValue);
                    break;

                default:
                    throw new Error(`Unsupported operator: ${operator}`);
            }
        });

        return {
            sql: sqlConditions.length > 0 ? `WHERE ${sqlConditions.join(' AND ')}` : '',
            values: values
        };
    }
}

module.exports = Core;
