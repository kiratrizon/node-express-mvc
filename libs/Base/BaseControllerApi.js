const express = require('express');
const LoadModel = require('../Service/LoadModel');
const GlobalFunctions = require('./GlobalFunctions');

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
            return next();
        }
    }
    guest(role) {
        return (req, res, next) => {
            return next();
        }
    }
    // end of auitentications
    set(key, value) {
        this.data[key] = value;
    }

    loadUses(models) {
        models.forEach(use => {
            this[use] = LoadModel.init(use);
        });
    }
}

module.exports = BaseController;