const Controller = require('../Controller');

class PostController extends Controller {
  constructor() {
    super();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get('/', this.getPost.bind(this));
  }

  getPost(req, res) {
    res.json({ message: 'this is Admin' });
  }

  getRouter() {
    return this.router;
  }
}

module.exports = new PostController().getRouter();
