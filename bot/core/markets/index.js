let realtimeMarket = require('./realtime');
let backtestMarket = require('./backtest');

module.exports = {
    'realtime': realtimeMarket,
    'paper': realtimeMarket,
    'backtest': backtestMarket
}