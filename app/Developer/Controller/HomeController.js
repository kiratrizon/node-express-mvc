const Controller = require('../Controller');

class HomeController extends Controller {
  constructor() {
    super();
    this.set('title', 'Home');
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.middleware('auth');
    this.get('/', this.getHome);
  }

  getHome(req, res) {
    res.json({ message: 'this is Developer' });
  }

  getRouter() {
    return this.router;
  }
}

module.exports = new HomeController().getRouter();
