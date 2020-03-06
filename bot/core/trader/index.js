const realtimeTrader = require('./realtimeTrader');
const paperTrader = require('./paperTrader');

module.exports = {
    'realtime': realtimeTrader,
    'paper': paperTrader
};