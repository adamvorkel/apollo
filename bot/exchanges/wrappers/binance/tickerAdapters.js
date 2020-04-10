const { Transform } = require('stream');

const isCandle = payload => payload.data && payload.data.e == 'kline';

class PriceTickerAdapter extends Transform {
    constructor() {
        super({ objectMode: true });
    }

    _transform(payload, _, done) {
        if(isCandle(payload)) {
            const kline = payload.data.k;
            this.push({
                pair: kline.s.toLowerCase(),
                time: kline.t,
                price: parseFloat(kline.c),
            });
        }
        done();
    }
}

// This currently does nothing
class BookTickerAdapter extends Transform {
    constructor() {
        super({ objectMode: true });
    }

    _transform(payload, _, done) {
        this.push(payload);
        done();
    }
}


module.exports = { PriceTickerAdapter, BookTickerAdapter };