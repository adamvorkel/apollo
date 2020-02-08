const EventEmitter = require('events');
const BinanceRest = require('../../core/markets/exchange/wrappers/binance');

class Portfolio {

}

class Broker extends EventEmitter {
    constructor() {
        super();
    }

    createOrder(order) {
        console.log("BROKER CREATING ORDER", order);
    }
}

class Trader extends EventEmitter {
    constructor() {
        super();
        this.broker = new Broker();
        this.price = null;
    }

    processCandle(candle) {
        this.price = candle.close;
        console.log(`Traders current price is ${this.price}`)
    }

    processAdvice(advice) {
        console.log("TRADER RECIEVED ADVICE", advice);
        const order = {};
        this.broker.createOrder(order);
    }
}

module.exports = Trader;