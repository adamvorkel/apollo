const strategy = require('../strategy');

class MyStrategy extends strategy {
    constructor(stratSettings) {
        super(stratSettings);
        this.addIndicator('testSMA', 'sma', {period: 5});
        this.addIndicator('testRSI', 'rsi', {period: 5})
    }

    init() {
        
    }

    check(candle) {
        //console.log("STRAT INDICATORS:");
        this.indicators.forEach((i, name) => {
            //console.log(`${name}: ${i.result}`);
        })
        // console.log("I am now running my strategy...");
    }

    update(candle) {
        // console.log("strategy update running");
    }
}

module.exports = MyStrategy;