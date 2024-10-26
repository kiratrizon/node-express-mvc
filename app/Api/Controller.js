const BaseController = require('../../libs/Base/BaseControllerApi');
class Controller extends BaseController {
  constructor() {
    super();
    this.user = 'api';
  }

  middleware(type) {
    if (this.allowedAuths.includes(type)) {
      this.router.use(this[type](this.user))
    } else {
      console.log('Invalid auth type');
    }
  }
}

module.exports = Controller;