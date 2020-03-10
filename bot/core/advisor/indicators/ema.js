

class EMA {
    constructor(options) {
        this.period = options.period;
        this.scale = 2 / (options.period + 1);
        this.result = null;
    }

    update(candle) {
        const price = candle.close;
        if(this.result === null) {
            this.result = price;
            return;
        }
        this.result = (1 - this.scale) * this.result + this.scale * price;
    }
}

module.exports = EMA;