const RealtimeBroker = require('./realtimeBroker');
const PaperBroker = require('./paperBroker');

 // Create portfolio here?

/**
 * Broker factory function
 * create broker instances depending on mode
 */ 
module.exports = {
    'realtime': RealtimeBroker,
    'paper': PaperBroker
};