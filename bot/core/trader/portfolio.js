const { EventEmitter } = require('events');

class Portfolio extends EventEmitter {
    constructor() {
        super();
        this.fee = null;
        this.balances = {};
        console.log('created portfolio instance');
    }

    update() {
        
    }
}

module.exports = Portfolio;