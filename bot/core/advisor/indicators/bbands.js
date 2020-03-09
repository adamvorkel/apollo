const SMA = require('./sma');
const STDDEV = require('./stddev');

class bbands {
    constructor(options) {
        this.period = options.period;
        this.stddevs = options.stddevs;
        this.result = 0;

        this.SMA = new SMA(options);
        this.STDDEV = new STDDEV(options);
        this.result = [0, 0, 0];
    }

    update(candle) {
        this.SMA.update(candle);
        this.STDDEV.update(candle);
        const lower = this.SMA.result - this.stddevs * this.STDDEV.result;
        const middle = this.SMA.result;
        const upper = this.SMA.result + this.stddevs * this.STDDEV.result;
        this.result = [lower, middle, upper];
    }
}

module.exports = bbands;