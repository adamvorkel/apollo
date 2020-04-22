const strategy = require('../strategy');

class MyStrategy extends strategy {
    constructor(params) {
        super(params);
        this.addIndicator('boll_21', 'sma', {period: 21});
        this.addIndicator('rsi_14', 'rsi', {period: 14});
    }

    init() {
    }

    check(candle) {
        console.log('Strategy got candle ', candle);
    }

    update(candle) {
    }
}

module.exports = MyStrategy;