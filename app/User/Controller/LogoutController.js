const Controller = require('../Controller');

class LogoutController extends Controller {
  constructor() {
    super();
    this.set('title', 'Logout');
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.middleware('auth')
    this.get('/', this.getLogout);
  }

  getLogout(req, res) {
    req.auth().logout();
    res.redirect(req.auth().redirectFail());
  }

  getRouter() {
    return this.router;
  }
}

module.exports = new LogoutController().getRouter();
