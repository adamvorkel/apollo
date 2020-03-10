

class RSI {
    constructor(options) {
        this.period = options.period;
        this.lastPrice;
        this.up = 0;
        this.down = 0;
        this.sup = 0;
        this.sdown = 0;
        this.result = null;
    }

    update(candle) {
        this.price = candle.close;
        if(!this.lastPrice) {
            this.lastPrice = this.price;
            return;
        }
        // console.log(this.price);
        this.up = (this.price > this.lastPrice) ? (this.price - this.lastPrice) : 0;
        // console.log(this.up)
        this.down = (this.price < this.lastPrice) ? (this.lastPrice - this.price) : 0;
        // console.log(this.down)
        this.sup = ((this.period - 1) / this.period) * this.sup + (1 / this.period) * this.up;
        // console.log(this.sup);
        this.sdown = ((this.period - 1) / this.period) * this.sdown + (1 / this.period) * this.down;
        // console.log(this.sdown)
        this.lastPrice = this.price;
        // console.log(this.sup / this.sdown)
        this.result = 100 - (100 / (1 + this.sup / this.sdown));
        console.log(this.result);
    }
}

module.exports = RSI;