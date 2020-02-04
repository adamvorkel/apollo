const EventEmitter = require('events');

class Strategy extends EventEmitter {
    constructor() {
        super();
        this.isStrategy = true;
    }

}

module.exports = Strategy;