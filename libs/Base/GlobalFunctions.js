class GlobalFunctions {
    constructor() {
    }

    only(obj, keys) {
        let newObj = {};
        keys.forEach(key => {
            if (obj[key] !== undefined) {
                newObj[key] = obj[key];
            }
        });
        return newObj;
    }
    ucFirst(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
}

module.exports = GlobalFunctions;