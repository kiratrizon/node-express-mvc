const Controller = require("../Controller");
class DashboardController extends Controller {
  constructor() {
    super();
    this.initializeRoutes();
    this.set("title", "Dashboard");
  }
  initializeRoutes() {
    this.middleware("auth");
    this.get("/", this.getDashboard);
  }
  getDashboard(req, res) {
    res.render("index", this.data);
  }
  getRouter() {
    return this.router;
  }
}
module.exports = new DashboardController().getRouter();
