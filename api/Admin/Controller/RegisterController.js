const Validator = require('../../../libs/Middleware/Validator');
const Hash = require('../../../libs/Service/Hash');
const Controller = require('../Controller');

class RegisterController extends Controller {
  constructor() {
    super();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.post('/', this.postRegister);
  }

  async postRegister(req, res) {
    res.json(res.header)
  }

  getRouter() {
    return this.router;
  }
}

module.exports = new RegisterController().getRouter();
