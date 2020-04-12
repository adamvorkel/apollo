const { EventEmitter } = require('events');

class Portfolio extends EventEmitter {
    constructor() {
        super();
        this.fee = null;
        this.balances = {};
    }

    update() {
        
    }
}

module.exports = Portfolio;