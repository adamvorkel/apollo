const EventEmitter = require('events');

class paperBroker extends EventEmitter {
    constructor() {
        super();
        console.log('BROOOOKER')
    }

    createOrder(order) {
    }
}

module.exports = paperBroker;