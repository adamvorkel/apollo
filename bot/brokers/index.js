const binance = require('./binance');
const mock = require('./mock');
 // Create portfolio here?

/**
 * Broker factory function
 * create broker instances depending on mode
 */ 
module.exports = {
    binance,
    mock,
};