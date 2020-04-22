const { Transform } = require('stream');

const isTicker = payload => payload.data && payload.data.e == '24hrTicker';

class PriceTickerAdapter extends Transform {
    constructor() {
        super({ objectMode: true });
    }

    _transform(payload, _, done) {
        if(isTicker(payload)) {
            let tickerData = payload.data;
            this.push({
                pair: tickerData.s.toLowerCase(),
                time: tickerData.E,
                price: parseFloat(tickerData.c),
                quantity: parseFloat(tickerData.Q),
                bid: parseFloat(tickerData.b),
                bidQuantity: parseFloat(tickerData.B),
                ask: parseFloat(tickerData.a),
                askQuantity: parseFloat(tickerData.A),
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