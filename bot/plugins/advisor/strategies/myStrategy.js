const baseStrategy = require('../strategy');

class MyStrategy extends baseStrategy {
    constructor(stratSettings) {
        super(stratSettings);        
    }

    check(candle) {
        console.log("MyStrategy can see the candles!")
    }

    
}

module.exports = MyStrategy;