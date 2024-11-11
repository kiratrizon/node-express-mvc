const Paginate = require("../Private/Paginate");

class Boot {

    constructor() {
        this.build = false;
    }
    up() {
    }
    builder() {
        this.build = true;
    }
}

module.exports = new Boot();