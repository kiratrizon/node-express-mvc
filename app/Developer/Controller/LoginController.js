const Validator = require("../../../libs/Middleware/Validator");
const Controller = require("../Controller");

class LoginController extends Controller {
    constructor() {
        super();
        this.loadUses([
            'Developer'
        ]);
        this.set("title", "Login");
        this.initializeRoutes();
    }

    initializeRoutes() {
        this.middleware("guest");
        this.get("/", this.getLogin);
        this.post("/", this.postLogin);
    }

    getLogin(req, res) {
        this.set("error", req.flash("error")[0] || false);
        this.set("old", req.flash("old")[0] || false);
        this.set("success", req.flash("success")[0] || false);
        res.render("index", this.data);
    }
    async postLogin(req, res) {
        let validate = await Validator.make(req.body, {
            username: "required",
            password: "required",
        });
        let fail = validate.fails();
        if (fail) {
            req.flash("error", validate.errors);
            req.flash("old", validate.old);
            return res.redirect(req.auth().guard(this.user).redirectFail());
        }
        let attempt = await req
            .auth()
            .guard(this.user)
            .attempt({ username: req.body.username, password: req.body.password });
        if (attempt) {
            return res.redirect(req.auth().guard(this.user).redirectAuth());
        }
        return res.redirect(req.auth().guard(this.user).redirectFail());
    }

    getRouter() {
        return this.router;
    }
}

module.exports = new LoginController().getRouter();
