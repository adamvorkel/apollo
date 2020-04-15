const EventEmitter = require('events');

class Portfolio extends EventEmitter {
    constructor() {
        super();
        this.balances = new Map();
    }

    set(balances) {
        this.balances = balances;
        this.emit('update', this.balances);
    }
}

module.exports = Portfolio;