const app = require('./boot/start');
const path = require('path');
const fs = require('fs');

// your session here
app.use((req, res, next) => {
    if (!req.session['auth']) {
        req.session['auth'] = {};
    }

    if (!req.session['auth']['user']) {
        req.session['auth']['user'] = {
            isAuthenticated: false,
            id: null,
        };
    }
    if (!req.session['auth']['admin']) {
        req.session['auth']['admin'] = {
            isAuthenticated: false,
            id: null,
        };
    }
    if (!req.session['auth']['developer']) {
        req.session['auth']['developer'] = {
            isAuthenticated: false,
            id: null,
        };
    }

    next();
});

const adminRouter = require('../app/Admin/Route/router');
const userRouter = require('../app/User/Route/router');
const apiRouter = require('../app/Api/Route/router');
const developerRouter = require('../app/Developer/Route/router');

// app.use(view());

app.use('/admin', adminRouter);

app.use('/developer', developerRouter);

app.use('/', userRouter);

app.use('/api', apiRouter);

// app.get('/', (req, res) => {
//     res.redirect('/dashboard');
// });
// app.get('/admin', (req, res) => {
//     res.redirect('/admin/dashboard');
// });


app.get('/debug', (req, res) => {
    if (true) {
        return res.send(req.session.auth);
    }
});

module.exports = app;
