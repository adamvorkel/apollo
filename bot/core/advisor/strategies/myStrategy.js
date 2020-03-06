const strategy = require('../strategy');

class MyStrategy extends strategy {
    constructor(stratSettings) {
        super(stratSettings);
        this.addIndicator('testSMA', 'sma', {windowLen: 5});
    }

    init() {
        
    }

    check(candle) {
        // console.log("I am now running my strategy...");
    }

    update(candle) {
        // console.log("strategy update running");
    }
}

module.exports = MyStrategy;