const DatabaseConnection = require('../../database/database');
const GlobalFunctions = require('../Base/GlobalFunctions');
class Core extends GlobalFunctions {
    fillable = [];
    timestamps = true;
    #privateColumns = {};
    #values;
    #modelName;
    #insertedId;
    constructor(tableName) {
        super();
        this.tableName = tableName;
        this.db = new DatabaseConnection();
        this.#values = [];
        this.#modelName = ''; // Initialize modelName
    }

    async find(type, options = {}) {
        let sql = `SELECT `;
        const {
            conditions = {},
            joins = [],
            fields = [],
            group = [],
            order = [],
        } = options;

        const limitAndOffset = this.#buildLimitOffset(options);
        const builtJoins = this.#buildJoins(joins);
        const builtConditions = this.#buildConditions(conditions);
        this.#values.push(...builtConditions.values);

        const selectedFields = fields.length ? fields : [`${this.#modelName}.*`, ...builtJoins.mixedTable];

        // Building SQL query based on type
        switch (type) {
            case 'count':
                sql += `COUNT(*) FROM ${this.tableName} AS ${this.#modelName} ${builtJoins.sql} ${builtConditions.sql} ${this.#buildGroup(group)} ${this.#buildOrder(order)};`;
                break;
            case 'all':
                sql += `${selectedFields.join(', ')} FROM ${this.tableName} AS ${this.#modelName} ${builtJoins.sql} ${builtConditions.sql} ${this.#buildGroup(group)} ${this.#buildOrder(order)} ${limitAndOffset};`;
                break;
            case 'first':
                sql += `${selectedFields.join(', ')} FROM ${this.tableName} AS ${this.#modelName} ${builtJoins.sql} ${builtConditions.sql} ${this.#buildGroup(group)} ${this.#buildOrder(order)} LIMIT 1;`;
                break;
            case 'list':
                sql += `${selectedFields.join(', ')} FROM ${this.tableName} AS ${this.#modelName} ${builtJoins.sql} ${builtConditions.sql} ${this.#buildGroup(group)} ${this.#buildOrder(order)} ${limitAndOffset};`;
                break;
            default:
                throw new Error(`Unsupported find type: ${type}`);
        }

        try {
            const data = await this.db.runQuery(sql, this.#values);
            if (data.length === 0) {
                return null;
            }
            return type === 'first' ? data[0] : data;
        } catch (error) {
            console.error("Error executing query:", error);
            throw error;
        } finally {
            this.#values = []; // Reset values for future queries
        }
    }

    async attemptFind(type, options = {}) {
        const { conditions = {} } = options;
        const builtConditions = this.#buildConditions(conditions);
        this.#values.push(...builtConditions.values);

        const sql = `SELECT * FROM ${this.tableName} ${builtConditions.sql} LIMIT 1;`;

        try {
            const data = await this.db.runQuery(sql, this.#values);
            return data[0] || null;
        } catch (error) {
            console.error("Error executing query:", error);
            throw error;
        } finally {
            this.#values = [];
        }
    }

    async count(params = {}) {
        try {
            const data = await this.find('count', params);
            this.countCache = data[0].count;
            return data[0].count;
        } catch (error) {
            console.error("Error executing count query:", error);
            throw error;
        }
    }

    setAlias(alias) {
        this.#modelName = alias;
    }

    #buildJoins(joins = []) {
        let sql = '';
        let mixedTable = [];

        joins.forEach((ele) => {
            let partialSql = ele.table;

            if (ele.as) {
                partialSql += ` AS ${ele.as}`;
                mixedTable.push(`${ele.as}.*`);
            } else {
                mixedTable.push(`${ele.table}.*`);
            }

            if (ele.conditions) {
                partialSql += ` ON ${this.#buildJoinConditions(ele.conditions)}`;
            }

            if (partialSql) {
                sql += ` ${ele.type || 'INNER'} JOIN ${partialSql}`;
            }
        });

        return {
            sql: sql.trim(),
            mixedTable,
        };
    }

    #buildJoinConditions(joinConditions) {
        if (typeof joinConditions === 'string') return joinConditions;

        if (Array.isArray(joinConditions) && joinConditions.length > 0) {
            let joinCondition = joinConditions.join(' AND ');
            return joinCondition;
        }
    }

    formatConditionValue(value) {
        if (Array.isArray(value) && value.length > 0) {
            return `(${value.join(', ')})`;
        }
        return value;
    }

    #buildConditions(conditions = {}) {
        let sqlConditions = [];
        let values = [];

        Object.entries(conditions).forEach(([key, condition]) => {
            const [operator, conditionValue] = condition;

            switch (operator.toUpperCase()) {
                case 'IS':
                    sqlConditions.push(`${key} IS ${conditionValue}`);
                    break;
                case 'IN':
                    const placeholders = conditionValue.map(() => '?').join(', ');
                    sqlConditions.push(`${key} IN (${placeholders})`);
                    values.push(...conditionValue);
                    break;
                case 'BETWEEN':
                    const [lowerBound, upperBound] = conditionValue;
                    sqlConditions.push(`${key} BETWEEN ? AND ?`);
                    values.push(lowerBound, upperBound);
                    break;
                case 'LIKE':
                case 'NOT LIKE':
                case '=':
                case '!=':
                case '>=':
                case '<=':
                case '>':
                case '<':
                    sqlConditions.push(`${key} ${operator} ?`);
                    values.push(conditionValue);
                    break;
                default:
                    throw new Error(`Unsupported operator: ${operator}`);
            }
        });

        return {
            sql: sqlConditions.length > 0 ? `WHERE ${sqlConditions.join(' AND ')}` : '',
            values,
        };
    }

    #buildOrder(orderConditions = []) {
        const orderClauses = orderConditions.map(order => {
            const [field, direction] = order.split(' ');
            const dir = direction.toUpperCase();
            if (!['ASC', 'DESC'].includes(dir)) {
                throw new Error(`Invalid order direction: ${dir}`);
            }
            return `${field} ${dir}`;
        });

        return orderClauses.length > 0 ? `ORDER BY ${orderClauses.join(', ')}` : '';
    }

    #buildGroup(groupConditions = []) {
        const validGroups = groupConditions.filter(field => typeof field === 'string' && field.trim() !== '');
        return validGroups.length > 0 ? `GROUP BY ${validGroups.join(', ')}` : '';
    }

    #buildLimitOffset(options = {}) {
        const limit = options.limit ? `LIMIT ${options.limit}` : '';
        const offset = options.offset ? `OFFSET ${options.offset}` : '';
        return `${limit} ${offset}`.trim();
    }

    async create(data = {}) {
        this.#privateColumns = {};
        this.set(data);
        const newData = {};
        this.fillable.forEach(column => newData[column] = this.#privateColumns[column]);
        this.#privateColumns = newData;
        return await this.save();
    }

    async #insert(data = {}) {
        if (!data || Object.keys(data).length === 0) {
            throw new Error('No data provided for insertion.');
        }

        const columns = Object.keys(data).join(', ');
        const placeholders = Object.keys(data).map(() => '?').join(', ');

        const sql = `INSERT INTO ${this.tableName} (${columns}) VALUES (${placeholders})`;
        this.#values = Object.values(data);

        try {
            const result = await this.db.runQuery(sql, this.#values);
            return result ?? null;
        } catch (error) {
            throw new Error(`Error inserting data: ${error.message}`);
        } finally {
            this.#privateColumns = {};
            this.#values = [];
        }
    }

    set(data = {}) {
        let keys = Object.keys(data);
        keys.forEach((ele) => {
            this.#privateColumns[ele] = data[ele];
        });
    }

    async save(data = {}) {
        if (Object.keys(data).length > 0) {
            this.set(data);
        }
        if (this.timestamps) {
            const now = new Date();
            this.#privateColumns.updated_at = this.formatDate(now);
            this.#privateColumns.created_at = this.formatDate(now);
        }
        if (!this.#privateColumns.id) {
            return await this.#insert(this.#privateColumns);
        } else {
            if (this.timestamps) {
                delete this.#privateColumns.created_at;
            }
            return await this.#update(this.#privateColumns);
        }
    }

    async #update() {
        this.#values = [];

        const fields = Object.entries(this.#privateColumns)
            .filter(([key]) => key !== 'id')
            .map(([key, value]) => {
                this.#values.push(value);
                return `${key} = ?`;
            })
            .join(", ");

        this.#values.push(this.#privateColumns.id);

        const sql = `UPDATE ${this.tableName} SET ${fields} WHERE id = ?`;

        try {
            let returnData = await this.db.runQuery(sql, this.#values);
            return returnData;
        } catch (error) {
            console.error("Update Error:", error);
            throw error;
        } finally {
            this.#privateColumns = {};
            this.#values = [];
        }
    }
    getModelName() {
        return this.#modelName;
    }

    async delete(id = null) {
        if (!id) throw new Error('No ID provided for deletion.');
        const sql = `DELETE FROM ${this.tableName} WHERE id =?`;
        this.#values = [id];

        try {
            let returnData = await this.db.runQuery(sql, this.#values);
            return returnData;
        } catch (error) {
            throw new Error(error);
        } finally {
            this.#values = [];
        }
    }

}

module.exports = Core;
