const Model = require("../Main/Model");

class Tokenable extends Model {
    hasApiToken = false;
    constructor(tableName) {
        super(tableName);
    }

    createToken(id = null) {
        if (!this.hasApiToken) throw new Error(`Please set ${this.modelName} model hasApiToken = true above from constructor`);
        if (!id) throw new Error(`Please set an id`);
    }
}

module.exports = Tokenable;