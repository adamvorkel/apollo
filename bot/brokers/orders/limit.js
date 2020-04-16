const { EventEmitter } = require('events');

const ORDER_TYPE = {
    BUY: 'BUY',
    SELL: 'SELL'
};

const ORDER_STATUS = {
    OPEN: 'OPEN',
    PARTIALLY_FILLED: 'PARTIALLY_FILLED',
    FILLED: 'FILLED',
    CANCELLED: 'CANCELLED',
    EXPIRED: 'EXPIRED'
};

class LimitOrder extends EventEmitter {
    constructor(params) {
        super();
        this.id = params.id;
        this.symbol = params.symbol;
        this.quantity = params.quantity;
        this.price = params.price;
        this.side = params.side;
        this.created = params.created;
        this.status = ORDER_STATUS.OPEN;
    }
}

module.exports = LimitOrder;