const BaseController = require('../../libs/Base/BaseControllerApi');
class Controller extends BaseController {
  AppUse = [
    'Admin',
    'User'
  ];
  constructor() {
    super();
    this.user = 'api';
    this.#initialize();
  }

  use(type) {
    if (this.allowedAuths.includes(type)) {
      this.router.use(this[type](this.user))
    } else {
      console.log('Invalid auth type');
    }
  }
  #initialize() {
    this.loadUses(this.AppUse);
  }
}

module.exports = Controller;