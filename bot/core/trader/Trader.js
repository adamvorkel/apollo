const EventEmitter = require('events');

class Trader extends EventEmitter {
    constructor(config) {
        super();
        this.config = config;
        this.price = null;
    }

    processCandle(candle) {
        this.price = candle.close;
        console.log(`${this.config.watch.asset} Trader:  ${this.price} ${this.config.watch.currency}`);
    }

    processAdvice(advice) {
        console.log("TRADER RECIEVED ADVICE", advice);
        const order = {};
    }
}

module.exports = Trader;