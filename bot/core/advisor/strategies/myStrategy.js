const strategy = require('../strategy');

class MyStrategy extends strategy {
    constructor(stratSettings) {
        super(stratSettings);        
    }

    check(candle) {
        console.log("I am now running my strategy...");
    }

    
}

module.exports = MyStrategy;