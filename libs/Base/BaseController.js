const express = require('express');
const LoadModel = require('../Service/LoadModel');
const GlobalFunctions = require('./GlobalFunctions');
const Configure = require('../Service/Configure');


class BaseController extends GlobalFunctions {
    allowedAuths = ['auth', 'guest'];
    data = {};
    constructor() {
        super();
        this.router = express.Router();
    }

    // authentications
    auth(role) {
        return (req, res, next) => {
            if (req.session.auth[role].isAuthenticated) {
                next();
                return;
            }
            return res.redirect(Configure.read(`auth.providers.${Configure.read(`auth.guards.${role}.provider`)}.failed`));
        }
    }
    guest(role) {
        return (req, res, next) => {
            if (!req.session.auth[role].isAuthenticated) {
                next();
                return;
            }
            return res.redirect(Configure.read(`auth.providers.${Configure.read(`auth.guards.${role}.provider`)}.passed`));
        }
    }
    // end of auitentications
    set(key, value) {
        this.data[key] = value;
    }

    loadUses(models) {
        if (Array.isArray(models)) {
            models.forEach(use => {
                this[use] = LoadModel.init(use);
            });
        }
    }
}

module.exports = BaseController;