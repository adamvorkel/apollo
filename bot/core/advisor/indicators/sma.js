class SMA {
    constructor(options) {
        this.period = options.period;
        this.prices = [];
        this.result = 0;
        this.age = 0;
        this.sum = 0;
    }

    update(candle) {
        const price = candle.close;
        let tail = this.prices[this.age] || 0;
        this.prices[this.age] = price;
        this.sum += price - tail;
        this.result = this.sum / this.prices.length;
        this.age = (this.age + 1) % this.period;
    }
}


module.exports = SMA;