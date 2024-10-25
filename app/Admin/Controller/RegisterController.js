const Validator = require('../../../libs/Middleware/Validator');
const Hash = require('../../../libs/Service/Hash');
const Controller = require('../Controller');

class RegisterController extends Controller {
  constructor() {
    super();
    this.loadUses([
      'Admin'
    ]);
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.use("guest");
    this.router.get('/', this.getRegister.bind(this));
    this.router.post('/', this.postRegister.bind(this));
  }

  getRegister(req, res) {
    let data = {
      title: "Register",
      error: req.flash("error")[0] || {},
      old: req.flash("old")[0] || {},
    };
    res.render("index", data);
  }
  async postRegister(req, res) {
    const validate = await Validator.make(req.body, {
      username: "required|unique:admins",
      email: "required|unique:admins",
      password: "required|confirmed",
    });
    let fail = validate.fails();

    // Check for validation failures
    if (fail) {
      req.flash("error", validate.errors);
      req.flash("old", validate.old);
      return res.redirect('/register');
    }
    let data = this.only(req.body, ["username", "email", "password"]);
    data.password = Hash.make(data.password);
    // Model
    let admin = await this.Admin.create(data);
    if (admin) {
      req.flash("success", "Admin created successfully.");
      return res.redirect(req.auth().redirectFail());
    }
    return res.redirect('/register');
  }

  getRouter() {
    return this.router;
  }
}

module.exports = new RegisterController().getRouter();
