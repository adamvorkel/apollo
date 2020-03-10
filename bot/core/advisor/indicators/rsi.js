
class RSI {
    constructor(options) {
        this.period = options.period;
        this.lastPrice;
        this.sup = 0;
        this.sdown = 0;
        this.result = null;
        this.age = 0;
    }

    update(candle) {
        this.price = candle.close;
        ++this.age;

        if(!this.lastPrice) {
            this.lastPrice = candle.close;
            return;
        }

        let upward = this.price > this.lastPrice ? this.price - this.lastPrice : 0;
        let downward = this.price < this.lastPrice ? this.lastPrice - this.price : 0;

        if(this.result) {
            this.sup = (upward - this.sup) * (1 / this.period) + this.sup;
            this.sdown = (downward - this.sdown) * (1 / this.period) + this.sdown;
        } else {
            this.sup += upward;
            this.sdown += downward;
            if(this.age > this.period) {
                this.sup /= this.period;
                this.sdown /= this.period;
            }
        }

        if(this.age > this.period) {
            this.result = 100 * (this.sup / (this.sup + this.sdown));
        }
        
        this.lastPrice = this.price;
    }
}

module.exports = RSI;