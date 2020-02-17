const EventEmitter = require('events');
const Broker = require('../broker');


class Trader extends EventEmitter {
    constructor(config) {
        super();
        this.config = config;
        this.broker = new Broker(config);
        this.price = null;
    }

    processCandle(candle) {
        this.price = candle.close;
        console.log(`${this.config.watch.asset} Trader:  ${this.price} ${this.config.watch.currency}`)
    }

    processAdvice(advice) {
        console.log("TRADER RECIEVED ADVICE", advice);
        const order = {};
        this.broker.createOrder(order);
    }
}

module.exports = Trader;