const EventEmitter = require('events');
const config = require('../config');

class Broker extends EventEmitter {
    constructor() {
        super();
        this.API;
        this.setupAPI();
    }

    setupAPI() {
        // console.log('About to setup ' + config.watch.exchange + ' API');
        // console.log("CONFIG: ", )
    }

    createOrder(order) {

    }
}

module.exports = Broker;