const Controller = require('../Controller');

class LogoutController extends Controller {
  constructor() {
    super();
    this.set('title', 'Logout');
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get('/', this.getLogout.bind(this));
  }

  getLogout(req, res) {
    req.auth().guard(this.user).logout();
    res.redirect(req.auth().guard(this.user).redirectFail());
  }

  getRouter() {
    return this.router;
  }
}

module.exports = new LogoutController().getRouter();
