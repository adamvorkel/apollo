const EventEmitter = require('events');

class Trader extends EventEmitter {
    constructor() {
        super();
    }

    processCandle(candle) {
        
    }

    processAdvice(advice) {
        console.log("TRADER RECIEVED ADVICE", advice);
    }
}

module.exports = Trader;