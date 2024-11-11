const User = require("../libs/Model/User");

const constant = {
    default: {
        guard: "user"
    },
    guards: {
        user: {
            driver: 'session',
            provider: 'users',
        }
    },
    providers: {
        users: {
            driver: 'eloquent',
            model: User,
            dashboard: '/dashboard',
            login: '/login',
            prefix: '/',
            entity: "User"
        }
    },
    access_tokens: {
        "User": { table: "user_access_tokens", }
    },
    secrets: {
        "User": { table: "user_secrets" }
    },
    bearer_tokens: {
        "User": { table: "user_bearers" }
    },
    token_table_structure: {
        user_id: { type: "integer" },
        name: { type: "string" },
        token: { type: "string" },
        expires_at: { type: "datetime" },
        last_used_at: { type: "datetime" },
        is_revoked: { type: "boolean", default: 0 },
        timestamp: true
    },
    // in days
    token_expiration: 356,
    secret_table_structure: {
        user_id: { type: "integer", },
        client_key: { type: "string", },
        client_secret: { type: "string", },
        timestamp: true
    },
    bearer_table_structure: {
        secret_id: { type: "integer" },
        name: { type: "string" },
        token: { type: "string" },
        expires_at: { type: "datetime" },
        last_used_at: { type: "datetime" },
        is_revoked: { type: "boolean", default: 0 },
        timestamp: true
    },
}

module.exports = constant;