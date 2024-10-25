const BaseController = require("../../libs/Base/BaseController");
class Controller extends BaseController {
  constructor() {
    super();
    this.user = "admin";
  }

  use(type) {
    if (this.allowedAuths.includes(type)) {
      this.router.use(this[type](this.user));
    } else {
      console.log("Invalid auth type");
    }
  }
}

module.exports = Controller;
