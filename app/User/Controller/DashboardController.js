const Controller = require('../Controller');

class DashboardController extends Controller {
  constructor() {
    super();
    this.loadUses([
      'User'
    ]);
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.use('auth');
    this.router.get('/', this.getDashboard.bind(this));
  }

  getDashboard(req, res) {
    res.json({ message: 'this is User' });
  }

  getRouter() {
    return this.router;
  }
}

module.exports = new DashboardController().getRouter();
