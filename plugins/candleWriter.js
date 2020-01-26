const path = require('path');
const util = require('../core/util');
const emitter = require(path.join(util.dirs().core, "emitter"));

class CandleWriter extends emitter {
    testPoop(foo) {
        console.log("Test poopie " + foo)
    }

    processCandle() {
        //console.log(`CandleWriter received a candle`)
    }

    finalize() {
        console.log(`CandleWriter closing`);
    }

    processTrades(trades) {
        //console.log(`CandleWriter recieved new trades...`);
        //console.log(trades);
    }
}

module.exports = CandleWriter;