const Controller = require('../Controller');

class ProfileController extends Controller {
  constructor() {
    super();
    this.initializeRoutes();
  }

  initializeRoutes() {
    // this.use('auth');
    this.router.get('/', this.getProfile.bind(this));
  }

  getProfile(req, res) {
    res.json({ message: 'this is User' });
  }

  getRouter() {
    return this.router;
  }
}

module.exports = new ProfileController().getRouter();
