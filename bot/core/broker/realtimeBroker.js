const EventEmitter = require('events');

class realtimeBroker extends EventEmitter {
    constructor() {
        super();
        console.log('BROOOOKER')
    }

    createOrder(order) {
    }
}

module.exports = realtimeBroker;