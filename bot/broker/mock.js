const EventEmitter = require('events');

class PaperBroker extends EventEmitter {
    constructor() {
        super();
    }

    createOrder(order) {
    }
}

module.exports = PaperBroker;