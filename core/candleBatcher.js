const {EventEmitter} = require('events');

class CandleBatcher extends EventEmitter {
    constructor(candleSize) {
        super();
        this.candleSize = candleSize;
        this.minuteCandles = [];
        this.completeCandles = [];
        this.emitted = 0;
    }

    write(candles) {
        candles.forEach(candle => {
            this.minuteCandles.push(candle);
            this.check();
        });
        return this.emitted;
    }

    check() {
        if(this.minuteCandles.length % this.candleSize === 0) {
            this.completeCandles.push(this.calculate());
            this.minuteCandles = [];
        }
    }

    calculate() {

        const candle = this.minuteCandles.reduce((acc, c) => {
            let agg = {
                high: Math.max(acc.high, c.high),
                low: Math.min(acc.low, c.low),
                trades: acc.trades + c.trades,
                volume: acc.volume + c.volume
            }

            return agg;
        }, {
            high: 0,
            low: Number.MAX_SAFE_INTEGER,
            trades: 0,
            volume: 0
        });

        candle.isClosed = true;
        
        const first = this.minuteCandles[0];
        const last = this.minuteCandles[this.candleSize - 1];
        
        candle.time = last.time;
        candle.start = first.start;
        candle.open = first.open;
        candle.close = last.close;
        console.log(candle);
        return candle;
    }
}


