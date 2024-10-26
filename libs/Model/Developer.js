const Model = require("../Main/Model");

class Developer extends Model {
    constructor() {
        super('developers');
        this.setAlias(this.constructor.name);
    }
    fillable = [
        'username',
        'password',
        'email',
    ]
}

module.exports = new Developer();
