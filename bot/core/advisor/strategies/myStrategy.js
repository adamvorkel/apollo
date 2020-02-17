const strategy = require('../strategy');

class MyStrategy extends strategy {
    constructor(stratSettings) {
        super(stratSettings);        
    }

    check(candle) {
        // console.log("MyStrategy can see the candles!");
    }

    
}

module.exports = MyStrategy;