const express = require('express');
const LoadModel = require('../Service/LoadModel');
const GlobalFunctions = require('./GlobalFunctions');
const Configure = require('../Service/Configure');
const Core = require('../Main/CoreClone');

class BaseController extends GlobalFunctions {
    allowedAuths = ['bearer', 'basic', 'basicAccess'];
    data = {};
    #modelName;
    #tokenTable;
    #privateDB;
    constructor(modelName) {
        super();
        this.#modelName = modelName;
        this.#tokenTable = Configure.read(`auth.access_tokens.${this.#modelName}.table`);
        this.router = express.Router();
        this.#privateDB = new Core(this.#tokenTable);
        this.loadUses([modelName]);
    }

    // authentications
    bearer(role) {
        return async (req, res, next) => {
            console.log(req.headers);
            // let token = req.headers['basic_access'];
            // if (!token) {
            //     res.status(401).json({ message: 'Unauthorized' });
            //     return;
            // }
            // let data = await this[this.#modelName].getUserByToken(token, 'bearer');
            // if (!data) {
            //     res.status(401).json({ message: 'Unauthorized' });
            //     return;
            // }
            // req.user = data;
            return next();
        }
    }
    basicAccess() {
        return async (req, res, next) => {
            let token = req.headers['basic_access'];
            if (!token) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }
            let data = await this[this.#modelName].getUserByToken(token);
            if (!data) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }
            delete data.password;
            req.user = data;
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
                if (!this[use]) {
                    this[use] = LoadModel.init(use);
                }
            });
        }
    }
    get(prefix, functionUsed) {
        this.router.get(`${prefix}`, functionUsed.bind(this));
    }
    post(prefix, functionUsed) {
        this.router.post(`${prefix}`, functionUsed.bind(this));
    }
    put(prefix, functionUsed) {
        this.router.put(`${prefix}`, functionUsed.bind(this));
    }
    delete(prefix, functionUsed) {
        this.router.delete(`${prefix}`, functionUsed.bind(this));
    }
}

module.exports = BaseController;