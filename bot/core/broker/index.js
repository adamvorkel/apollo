const realtimeBroker = require('./realtimeBroker');
const paperBroker = require('./paperBroker');

 // Create portfolio here?

/**
 * Broker factory function
 * create broker instances depending on mode
 */ 
module.exports = (config) => {
    const mode = config.mode;
    switch(mode) {
        case 'realtime': 
            return new realtimeBroker(config);
        case 'paper':
            return new paperBroker(config);
        default: 
            return null;
    }
}