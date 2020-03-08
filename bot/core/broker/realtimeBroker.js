const EventEmitter = require('events');

class RealtimeBroker extends EventEmitter {
    constructor() {
        super();
    }

    createOrder(order) {
    }
}

module.exports = RealtimeBroker;