const Controller = require('../../Controller.js');

class VerifyController extends Controller {
  constructor() {
    super();
    this.set('title', 'Verify');
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get('/', this.getVerify.bind(this));
  }

  getVerify(req, res) {
    res.json({ message: 'this is Developer' });
  }

  getRouter() {
    return this.router;
  }
}

module.exports = new VerifyController().getRouter();
