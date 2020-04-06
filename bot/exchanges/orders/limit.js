const { EventEmitter } = require('events');

const ORDER_TYPE = {
    BUY: 'BUY',
    SELL: 'SELL'
};

const ORDER_STATE = {
    SUBMITTED: 'SUBMITTED'
}

class LimitOrder extends EventEmitter {
    constructor(params) {
        super();
        this.side = params.side;
        this.amount = params.amount;
    }


}

module.exports = LimitOrder;