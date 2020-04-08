const { Transform } = require('stream');

const isCandle = payload => payload.data && payload.data.e == 'kline';
const isClosed = kline => kline.x;

class CandleAdapter extends Transform {
    constructor() {
        super({ objectMode: true });
    }

    _transform(payload, _, done) {
        // filter out anything that isn't a candle
        if(isCandle(payload)) {
            const kline = payload.data.k;
            // only push closed candles
            if(isClosed(kline)) {
                const candle = {
                    pair: kline.s.toLowerCase(),
                    start: kline.t,
                    open: parseFloat(kline.o),
                    close: parseFloat(kline.c),
                    high: parseFloat(kline.h),
                    low: parseFloat(kline.l),
                    trades: parseInt(kline.n),
                    volume: parseFloat(kline.v)
                };
        
                this.push(candle);
            }
        }
        
        done();
    }
}

module.exports = CandleAdapter;