const express = require('express');
const PathFinder = require('./PathFinder');
const Boot = require('./Boot');
const app = express();
require('dotenv').config();
Boot.builder();

app.use(express.static(PathFinder.resource_path()));
app.get('/resources', (req, res) => {
    const build = true;
    res.status(200).json({ build });
});
app.listen(process.env.BUILDER_PORT || 9876);
