const strategy = require('../strategy');

class MyStrategy extends strategy {
    constructor(params) {
        super(params);
        this.addIndicator('testSMA', 'sma', {period: 5});
        this.addIndicator('testRSI', 'rsi', {period: 5})
    }

    init() {
        
    }

    check(candle) {
        console.log('Strategy got candle ', candle);
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