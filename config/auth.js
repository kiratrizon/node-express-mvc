const Admin = require("../libs/Model/Admin");
const User = require("../libs/Model/User");
const Developer = require("../libs/Model/Developer");

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
        },
        developer: {
            driver: 'session',
            provider: 'developers',
        }
    },
    providers: {
        users: {
            driver: 'eloquent',
            model: User,
            passed: '/dashboard',
            failed: '/login',
            prefix: '/',
        },
        admins: {
            driver: 'eloquent',
            model: Admin,
            passed: '/admin/dashboard',
            failed: '/admin/login',
            prefix: '/admin',
        },
        developers: {
            driver: 'eloquent',
            model: Developer,
            passed: '/developer/dashboard',
            failed: '/developer/login',
            prefix: '/developer',
        }
    },
};

module.exports = constant;