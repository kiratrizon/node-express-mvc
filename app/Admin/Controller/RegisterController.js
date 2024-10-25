const Validator = require("../../../libs/Middleware/Validator");
const Admin = require("../../../libs/Model/Admin");
const Controller = require("../Controller");

class RegisterController extends Controller {
  constructor() {
    super();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.use("guest");
    this.router.get("/", this.getRegister.bind(this));
    this.router.post("/", this.postRegister.bind(this));
  }

  getRegister(req, res) {
    let data = {
      title: "Register",
      error: req.flash("error")[0] || {},
      old: req.flash("old")[0] || {},
    };
    // res.json('hello')
    res.render("index", data);
  }
  async postRegister(req, res) {
    // Await the validation to complete
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
      return res.redirect("/admin/register");
    }
    // Model
    let AdminModel = Admin;
    let user = await AdminModel.create(req.body);
    if (user) {
      req.flash("success", "Admin created successfully.");
      return res.redirect(req.auth().guard("admin").redirectFail());
    }
    return res.redirect("/admin/register");
  }

  getRouter() {
    return this.router;
  }
}

module.exports = new RegisterController().getRouter();
