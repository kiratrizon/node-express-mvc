const Model = require("../Main/Model");
const crypto = require("crypto");
const Validator = require("../Middleware/Validator");
const Core = require("../Main/CoreClone");
const Configure = require("../Service/Configure");

class Tokenable extends Model {
    #tokenName;
    token;
    #tokenable = true;
    #tableUsed = null;
    constructor(tableName) {
        super(tableName);
    }

    async createToken(user_id = null, name = "token", expires = Configure.read('auth.token_expiration')) {
        if (!user_id) {
            throw new Error(`ID is required to generate a token for ${this.getModelName()}`);
        }
        this.#setTableUsed('access_tokens');
        this.#tokenName = name;
        let token;
        let validate = true;
        do {
            token = crypto.randomBytes(name == 'token' ? 16 : (name == 'bearer' ? 32 : 24)).toString('hex');
            validate = await Validator.make({ token }, {
                token: `required|unique:${Configure.read(`auth.access_tokens.${this.getModelName()}.table`)}`
            });
        } while (validate.fails());
        let expires_at = this.getFutureDate(expires);
        this.#tableUsed.set({ user_id, token, name, expires_at });
        let data = await this.#tableUsed.save();
        if (data) {
            return token;
        } else {
            throw new Error(`Failed to create token for ${this.getModelName()}`);
        }
    }

    async getUserBySecret(client_key, client_secret) {
        const secretTable = Configure.read(`auth.secrets.${this.getModelName()}.table`);
        const secretAlias = `${this.getModelName()}Secret`;
        const alias = this.getModelName();

        let paramsSecret = {};
        paramsSecret['fields'] = [
            `${secretAlias}.id as secret_id`, `${alias}.*`
        ];
        paramsSecret.conditions = [
            [`${secretAlias}.client_key`, '=', client_key],
            [`${secretAlias}.client_secret`, '=', client_secret]
        ]
        paramsSecret['joins'] = [
            {
                table: secretTable,
                as: secretAlias,
                conditions: [
                    `${alias}.id = ${secretAlias}.user_id`
                ],
                type: 'LEFT'
            }
        ];
        let secret = await this.find('first', paramsSecret);
        if (secret) delete secret.password;
        return secret ?? false;
    }
    #setTableUsed(table) {
        if (Configure.read(`auth.${table}.${this.getModelName()}.table`) === undefined) {
            throw new Error(`Table name for ${this.getModelName()} is not configured in auth.${table}`);
        }
        this.#tableUsed = new Core(Configure.read(`auth.${table}.${this.getModelName()}.table`));
    }

    async getToken(id = null, name = 'token') {
        let allowedAuths = ['token', 'bearer'];
        if (!id && !name) {
            throw new Error(`Either ID or name is required to retrieve a token for ${this.getModelName()}`);
        }
        this.#setTableUsed(name == 'token' ? 'access_tokens' : 'bearer_tokens');
        let params = {};
        params.conditions = [];
        if (id) {
            params.conditions.push(["user_id", '=', id])
        }
        if (name) {
            params.conditions.push(['name', '=', name]);
        }
        let token = await this.#tableUsed.find(params);
        if (!token ?? new Date(token.expires_at) < new Date()) {
            return await this.createToken(id, name);
        }
        return token.token;
    }
    async getUserByToken(token = null, name = 'token') {
        const alias = this.getModelName();
        if (!token) {
            throw new Error(`Token is required to retrieve a user for ${alias}`);
        }
        const tokenTable = Configure.read(`auth.access_tokens.${alias}.table`);
        const tokenAlias = `${alias}Token`;
        const secretTable = Configure.read(`auth.secrets.${alias}.table`);
        const secretAlias = `${alias}Secret`;
        const params = {};
        params['fields'] = [
            `${alias}.*`, `${tokenAlias}.id as token_id`
        ];
        params['conditions'] = [
            [`${tokenAlias}.token`, '=', token],
            [`${tokenAlias}.name`, '=', name],
            [`${tokenAlias}.expires_at`, '>', this.formatDate(new Date())],
            [`${tokenAlias}.is_revoked`, '=', 0]
        ];
        params['joins'] = [
            {
                table: tokenTable,
                as: tokenAlias,
                type: 'LEFT',
                conditions: [
                    `${alias}.id = ${tokenAlias}.user_id`
                ]
            },
            {
                table: secretTable,
                as: secretAlias,
                type: 'LEFT',
                conditions: [
                    `${alias}.id = ${secretAlias}.user_id`
                ]
            }
        ];
        let data = await this.find('first', params);
        if (!data) {
            return false;
        }
        delete data.password;
        data['client_service'] = await this.getUserSecret(data.id)
        return data;
    }

    async #createSecret(user_id = null) {
        if (!user_id) {
            throw new Error(`ID is required to generate a secret for ${this.getModelName()}`);
        }
        this.#setTableUsed('secrets');
        let client_secret;
        let client_key
        let validate = true;
        do {
            client_secret = crypto.randomBytes(4).toString('hex');
            client_key = crypto.randomBytes(4).toString('hex');
            let secretData = { client_secret, client_key };
            validate = await Validator.make({ secretData }, {
                secretData: `exists:${Configure.read(`auth.secrets.${this.getModelName()}.table`)}`
            });
        } while (validate.fails());
        this.#tableUsed.set({ user_id, client_key, client_secret });
        let data = await this.#tableUsed.save();
        if (data) {
            return data;
        }
        return false;
    }

    async getBearer(secret_id, name = 'bearer') {
        this.#setTableUsed('bearer_tokens');
        const bearerTable = this.#tableUsed.tableName;
        const alias = this.getModelName();
        const bearerAlias = `${alias}Bearer`;
        const secretTable = Configure.read(`auth.secrets.${this.getModelName()}.table`);
        const secretAlias = `${alias}Secret`;
        let params = {};
        params['fields'] = [
            `${bearerAlias}.token`
        ];
        params['conditions'] = [
            [`${secretAlias}.id`, '=', secret_id],
            [`${bearerAlias}.name`, '=', name],
            [`${bearerAlias}.expires_at`, '>', this.formatDate(new Date())],
            [`${bearerAlias}.is_revoked`, '=', 0]
        ];
        params['joins'] = [
            {
                table: secretTable,
                as: secretAlias,
                type: 'LEFT',
                conditions: [
                    `${alias}.id = ${secretAlias}.user_id`
                ]
            },
            {
                table: bearerTable,
                as: bearerAlias,
                type: 'LEFT',
                conditions: [
                    `${secretAlias}.id = ${bearerAlias}.secret_id`
                ]
            }
        ];
        const bearer = await this.find('first', params);
        if (!bearer) {
            return await this.#createBearer(secret_id, name);
        }
        return bearer.token;
    }

    async #createBearer(secret_id, name = 'bearer', expires_at = Configure.read('auth.token_expiration')) {
        this.#setTableUsed('bearer_tokens');
        let token;
        let validate;
        do {
            token = this.generateRandomToken(32);
            validate = await Validator.make({ token }, {
                token: `unique:${this.#tableUsed.tableName}`
            });
        }
        while (validate.fails());
        expires_at = this.getFutureDate(expires_at);
        this.#tableUsed.set({ secret_id, token, name, expires_at });
        let data = await this.#tableUsed.save();
        return data ? token : false;
    }

    generateRandomToken(length = 16) {
        return crypto.randomBytes(length).toString('hex');
    }

    async getUserByBearer(bearer, name = 'bearer') {
        const alias = this.getModelName();
        const bearerTable = Configure.read(`auth.bearer_tokens.${alias}.table`);
        const bearerAlias = `${alias}Bearer`;
        const secretTable = Configure.read(`auth.secrets.${alias}.table`);
        const secretAlias = `${alias}Secret`;
        const params = {};
        params['fields'] = [
            `${alias}.*`, `${bearerAlias}.id as bearer_id`
        ];
        params['conditions'] = [
            [`${bearerAlias}.token`, '=', bearer],
            [`${bearerAlias}.name`, '=', name],
            [`${bearerAlias}.expires_at`, '>', this.formatDate(new Date())],
            [`${bearerAlias}.is_revoked`, '=', 0]
        ];
        params['joins'] = [
            {
                table: bearerTable,
                as: bearerAlias,
                type: 'LEFT',
                conditions: [
                    `${alias}.id = ${bearerAlias}.secret_id`
                ]
            },
            {
                table: secretTable,
                as: secretAlias,
                type: 'LEFT',
                conditions: [
                    `${secretAlias}.id = ${bearerAlias}.secret_id`
                ]
            }
        ];
        let data = await this.find('first', params);
        if (!data) {
            return false;
        }
        delete data.password;
        return data;
    }

    async getUserSecret(user_id) {
        this.#setTableUsed('secrets');
        const params = {};
        params['fields'] = [
            'client_key', 'client_secret'
        ];
        params['conditions'] = [
            [user_id, '=', user_id]
        ];

        let data = await this.#tableUsed.find(params);
        this.log(data, 'secret', 'test');
        if (!data) {
            await this.#createSecret(user_id);
            return await this.getUserSecret(user_id);
        }

        return data;
    }

    async revokeBearer(id = null) {
        if (!id) {
            throw new Error('ID is required to revoke a bearer token');
        }
        this.#setTableUsed('bearer_tokens');
        this.#tableUsed.set({ id: id });
        this.#tableUsed.set({ is_revoked: 1 });
        return await this.#tableUsed.save();
    }

    async revokeToken(id = null) {
        if (!id) {
            throw new Error('ID is required to revoke a token');
        }
        this.#setTableUsed('access_tokens');
        this.#tableUsed.set({ id: id });
        this.#tableUsed.set({ is_revoked: 1 });
        return await this.#tableUsed.save();
    }
}

module.exports = Tokenable;