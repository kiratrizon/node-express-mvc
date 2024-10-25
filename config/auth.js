const Admin = require("../libs/Model/Admin");

// ensure that all keys are in lowercase
const constant = {
    default: {
        guard: "user"
    },
    guards: {
        user: {
            driver: 'session',
            provider: 'users',
        },
        admin: {
            driver: 'session',
            provider: 'admins',
        }
    },
    providers: {
        users: {
            driver: 'database',
            table: 'users',
            passed: '/dashboard',
            failed: '/login',
        },
        admins: {
            driver: 'eloquent',
            model: Admin,
            passed: '/admin/dashboard',
            failed: '/admin/login',
        }
    },
};

module.exports = constant;