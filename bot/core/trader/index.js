const realtimeTrader = require('./realtimeTrader');
const paperTrader = require('./paperTrader');

// factory to create trader instances depending on mode
module.exports = (config) => {
    const mode = config.mode;
    switch(mode) {
        case 'realtime': 
            return new realtimeTrader(config);
        case 'paper':
            return new paperTrader(config);
        default: 
            return null;
    }
}