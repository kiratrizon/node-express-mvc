const Validator = require("../../../libs/Middleware/Validator");
const Controller = require("../Controller");

class LoginController extends Controller {
  constructor() {
    super();
    this.initializeRoutes();
  }

  initializeRoutes() {

  }

  apiAdmin(req, res) {
  }

  getRouter() {
    return this.router;
  }
}

module.exports = new LoginController().getRouter();
