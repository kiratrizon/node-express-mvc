const Model = require("../Main/Model");
const crypto = require("crypto");
const Validator = require("../Middleware/Validator");
const Core = require("../Main/CoreClone");
const Configure = require("../Service/Configure");

class Tokenable extends Model {
    #tokenName;
    token;
    #tokenable = true;
    #privateCore = null;
    constructor(tableName) {
        super(tableName);
    }

    async createToken(user_id = null, name = "token", expires = Configure.read('auth.token_expiration')) {
        if (!user_id) {
            throw new Error(`ID is required to generate a token for ${this.getModelName()}`);
        }
        this.#generatePrivateCore(name == 'token' ? 'access_tokens' : 'secrets');
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
        this.#privateCore.set({ user_id, token, name, expires_at });
        let data = await this.#privateCore.save();
        if (data) {
            return token;
        } else {
            throw new Error(`Failed to create token for ${this.getModelName()}`);
        }
    }

    async getSecret(user_id) {
        this.#generatePrivateCore('access_tokens');
        let paramsSecret = {};
        paramsSecret.conditions = {
            id: ['=', user_id],
        }
        let secret = await this.#privateCore.find(paramsSecret);
    }
    #generatePrivateCore(table) {
        if (Configure.read(`auth.${table}.${this.getModelName()}.table`) === undefined) {
            throw new Error(`Table name for ${this.getModelName()} is not configured in auth.${table}`);
        }
        this.#privateCore = new Core(Configure.read(`auth.${table}.${this.getModelName()}.table`));
    }

    async getToken(id = null, name = 'token') {
        if (!id && !name) {
            throw new Error(`Either ID or name is required to retrieve a token for ${this.getModelName()}`);
        }
        this.#generatePrivateCore(name == 'token' ? 'access_tokens' : 'secrets');
        let params = {};
        params.conditions = {};
        if (id) {
            params.conditions.user_id = ['=', id];
        }
        if (name) {
            params.conditions.name = ['=', name];
        }
        let token = await this.#privateCore.find(params);
        if (!token || new Date(token.expires_at) < new Date()) {
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
            `${alias}.*`, `${secretAlias}.client_key`, `${secretAlias}.client_secret`
        ];
        params['conditions'] = {
            [`${tokenAlias}.token`]: ['=', token],
            [`${tokenAlias}.name`]: ['=', name],
            [`${tokenAlias}.expires_at`]: ['>', this.formatDate(new Date())],
            [`${tokenAlias}.is_revoked`]: ['=', 0]
        };
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
        return data ?? false;
    }

    async createSecret(user_id = null) {
        if (!user_id) {
            throw new Error(`ID is required to generate a secret for ${this.getModelName()}`);
        }
        this.#generatePrivateCore('secrets');
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
        this.#privateCore.set({ user_id, client_key, client_secret });
        let data = await this.#privateCore.save();
        if (data) {
            return data;
        }
        return false;
    }
}

module.exports = Tokenable;