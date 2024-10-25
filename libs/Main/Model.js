const Core = require('./Core');

class Model extends Core {
    constructor(tableName) {
        super(tableName);
    }
    setAlias(alias) {
        super.setAlias(alias);
    }

    find(type = 'all', options) {
        return super.find(type, options);
    }

}

module.exports = Model;