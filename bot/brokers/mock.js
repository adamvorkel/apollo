const EventEmitter = require('events');

class PaperBroker extends EventEmitter {
    constructor(portfolio) {
        super();
        this.portfolio = portfolio;
    }

    
}

module.exports = PaperBroker;