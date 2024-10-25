const express = require('express');
const path = require('path');
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);
const flash = require('connect-flash');
const Configure = require('../../libs/Service/Configure');
const Auth = require('../../libs/Middleware/Auth');
const fs = require('fs');

const app = express();
app.use(session({
    secret: '272b1a3a2b5c03402b70d18fa93555fcc1d53c583b32258b8ae5bf4be6414d2e339232704e2270fe30bcf1860bb68e507c304ae4d49024d52c4cbc8871d38b2d',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

app.use(flash());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..', '..', 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '..', 'View'));

function ucFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

app.use((req, res, next) => {
    res.locals.config = (value) => Configure.read(value);
    res.locals.auth = () => new Auth(req);
    req.auth = () => new Auth(req);
    req.uriPath = req.path.split('/');
    req.uriPath.shift();
    const routeSource = ['admin', 'api'];
    if (!routeSource.includes(req.uriPath[0])) {
        req.routeSrc = {
            type: ucFirst('user'),
            controller: ucFirst(req.uriPath[0] || 'index')
        };
    } else {
        req.routeSrc = {
            type: ucFirst(req.uriPath[0]),
            controller: ucFirst(req.uriPath[1] || 'index')
        };
    }
    next();
});
app.use((req, res, next) => {
    let splittedUrl = req.path.split('/');
    if (splittedUrl[1] === 'user') {
        splittedUrl.splice(1, 1);
        let newPath = splittedUrl.join('/') || '/';
        return res.redirect(newPath);
    }
    next();
});

app.use((req, res, next) => {
    const originalRender = res.render;

    res.render = function (view, locals, callback) {
        let newView = fs.existsSync(path.join(__dirname, '..', 'View', req.routeSrc.type, req.routeSrc.controller, `${view}.ejs`)) ? `${req.routeSrc.type}/${req.routeSrc.controller}/${view}` : path.join(__dirname, '..', 'View', view);
        originalRender.call(this, newView, locals, callback);
    };

    next();
});


module.exports = app;
