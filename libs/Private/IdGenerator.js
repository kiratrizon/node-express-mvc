class IdGenerator {

    #id
    constructor(id) {
        this.#id = id
    }
    id() {
        return this.#id
    }
}

module.exports = IdGenerator;