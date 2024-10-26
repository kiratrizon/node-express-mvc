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

    loadUses(models = []) {
        if (Array.isArray(models) && models.length > 0) {
            models.forEach(use => {
                this[use] = LoadModel.init(use);
            });
        }
    }
    get(prefix, functionUsed) {
        this.router.get(`${this.prefix}${prefix}`, functionUsed.bind(this));
    }
    post(prefix, functionUsed) {
        this.router.post(`${this.prefix}${prefix}`, functionUsed.bind(this));
    }
    put(prefix, functionUsed) {
        this.router.put(`${this.prefix}${prefix}`, functionUsed.bind(this));
    }
    delete(prefix, functionUsed) {
        this.router.delete(`${this.prefix}${prefix}`, functionUsed.bind(this));
    }
}

module.exports = BaseController;