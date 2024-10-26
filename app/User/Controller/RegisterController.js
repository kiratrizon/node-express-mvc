const Validator = require('../../../libs/Middleware/Validator');
const Hash = require('../../../libs/Service/Hash');
const Controller = require('../Controller');

class RegisterController extends Controller {
  constructor() {
    super();
    this.loadUses([
      'User'
    ]);
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.middleware("guest");
    this.get('/', this.getRegister);
    this.post('/', this.postRegister);
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
      username: "required|unique:users",
      email: "required|unique:users",
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
    let user = await this.User.create(data);
    if (user) {
      let mailer = new this.mailer();
      await mailer.sendMail({
        to: data.email,
        subject: "Welcome",
        header: "Account created successfully.",
        content: "This is an example mailer."
      });
      req.flash("success", "User created successfully.");
      return res.redirect(req.auth().redirectFail());
    }
    return res.redirect('/register');
  }

  getRouter() {
    return this.router;
  }
}

module.exports = new RegisterController().getRouter();
