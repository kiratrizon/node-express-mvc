const Controller = require('../Controller');

class PostController extends Controller {
  constructor() {
    super();
    this.set('title', 'Post');
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get('/', this.getPost.bind(this));
  }

  getPost(req, res) {
    res.json({ message: 'this is User' });
  }

  getRouter() {
    return this.router;
  }
}

module.exports = new PostController().getRouter();
