const BaseController = require('../../libs/Base/BaseController');
class Controller extends BaseController {
  constructor() {
    super();
    this.user = 'user';
  }

  middleware(type) {
    if (this.allowedAuths.includes(type)) {
      this.router.use(this[type](this.user))
    }
  }

}

module.exports = Controller;