const SMA = require('./sma');

class STDDEV {
    constructor(options) {
        this.period = options.period;
        this.prices = [];
        this.result = 0;
        this.age = 0;
        this.sum = 0;

        this.devs = [];

        this.MA = new SMA(options);
        this.MA2 = new SMA(options);
    }

    update(candle) {
        const price = candle.close;
        const priceSquared = price*price;
        let candle2 = {close: priceSquared}
        
        this.MA.update(candle);
        this.MA2.update(candle2);
        let variance = this.MA2.result - Math.pow(this.MA.result, 2);

        this.result = Math.sqrt(variance);
    }
}

module.exports = STDDEV;