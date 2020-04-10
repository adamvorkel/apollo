const { EventEmitter } = require('events');


class Analyzer extends EventEmitter {
    constructor(config) {
        super();
    }
}

module.exports = Analyzer;