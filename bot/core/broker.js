const EventEmitter = require('events');

class Broker extends EventEmitter {
    constructor() {
        super();
        this.API;
    }



    createOrder(order) {
    }
}

module.exports = Broker;