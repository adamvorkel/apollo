const { Transform } = require('stream');

class CandleBatcher extends Transform {
    constructor(interval) {
        super({ objectMode: true });
        this.interval = interval;
        this.bucket = [];
    }

    batch() {
        return this.bucket.reduce((accumulator, current, index) => {
            if(index == 0) accumulator.open = current.open;
            if(index == this.interval - 1) accumulator.close = current.close;
            accumulator.volume += current.volume;
            if(accumulator.high < current.high) accumulator.high = current.high;
            if(accumulator.low > current.low) accumulator.low = current.low;
            return accumulator;
        });
    }

    _transform(candle, _, done) {
        this.bucket.push(candle);
        if(this.bucket.length === this.interval) {
            this.push(this.batch());
            this.bucket = [];
        }
        done();
    }
}

module.exports = CandleBatcher;