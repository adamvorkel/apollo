const EventEmitter = require('events');
const portfolio = require('./portfolio');

class PaperBroker extends EventEmitter {
    constructor(portfolio) {
        super();
        this.portfolio = portfolio;
    }

    
}

module.exports = PaperBroker;