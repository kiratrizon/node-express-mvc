const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const Configure = require('../../../libs/Service/Configure');

const controllersPath = path.join(__dirname, '..', 'Controller');
const home = `/${Configure.read('default.prefix_controller').toLowerCase()}`;

fs.readdir(controllersPath, (err, files) => {
    if (err) {
        console.error('Error reading controllers directory:', err);
        return;
    }

    files.filter(file => file.endsWith('.js')).forEach((file) => {
        const controllerPath = path.join(controllersPath, file);

        const controller = require(controllerPath);

        const routePath = `/${path.parse(file).name}`.toLowerCase();
        let fileNameWithoutSuffix = routePath.replace('controller', '');
        fileNameWithoutSuffix = fileNameWithoutSuffix === home ? '/' : fileNameWithoutSuffix;
        router.use(fileNameWithoutSuffix, controller);
    });
});

module.exports = router;
