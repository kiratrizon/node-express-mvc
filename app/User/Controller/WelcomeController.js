const Controller = require('../Controller.js');

class WelcomeController extends Controller {
  constructor() {
    super();
    this.set('title', 'Welcome');
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.get('/', this.getWelcome);
  }

  getWelcome(req, res) {
    this.render('index');
  }

  getRouter() {
    return this.router;
  }
}

module.exports = new WelcomeController().getRouter();
