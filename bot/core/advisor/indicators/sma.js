class SMA {
    constructor(config) {
        this.windowLen = config.windowLen;
        this.prices = [];
        this.result = 0;
        this.age = 0;
        this.sum = 0;
    }

    update(candle) {
        const price = candle.close;
        console.log(`Updating SMA with candle close ${price} | windowLen: ${this.windowLen}`);
        let tail = this.prices[this.age] || 0;
        this.prices[this.age] = price;
        this.sum += price - tail;
        this.result = this.sum / this.prices.length;
        this.age = (this.age + 1) % this.windowLen;
        console.log(`Result: ${this.result} | Tail ${tail} | Sum: ${this.sum} | Age: ${this.age} | Prices: ${this.prices}`);
        console.log('SMA result ', this.result)
    }
}


module.exports = SMA;