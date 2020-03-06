const PaperTrader = require('./paperTrader');

let config = {
    watch: {
        currency: 'USDT',
        asset: 'BTC'
    },
    portfolio: {
        asset: 1,
        currency: 100
    }
}

const pt = new PaperTrader(config);

pt.processAdvice({action: 'buy', stop: {
    type: 'trail',
    price: 100,
    trail: 10
}});

let prices = [100, 102 , 105, 101, 105, 108, 112, 108, 100.80];
// let prices = [110, 109, 108, 107, 106, 105, 104, 103, 102, 101];
let interval = setInterval(() => {
    pt.processCandle({close: prices.shift()});
    if(prices.length === 0) clearInterval(interval); 
}, 500);