const EventEmitter = require('events');
const path = require('path');

class Strategy extends EventEmitter {
    constructor(params) {
        super();

        this.age = 0;
        this.ready = false;
        this.indicators = new Map();
        this.requiredHistory = params.requiredHistory || 1;
    }

    init() {
        throw new Error(`init method must be implemented in strategy`);
    }

    check(candle) {
        throw new Error(`check method must be implemented in strategy`);
    }

    update(candle) {}

    tick(candle) {
        ++this.age;

        this.indicators.forEach((indicator, name) => {
            indicator.update(candle);
        });

        // console.log(`I need ${this.requiredHistory} candles, I have ${this.age} so far.`)

        //propogate tick
        this.update(candle);

        if(!this.ready) {
            if(this.age >= this.requiredHistory) {
                this.ready = true;
                this.emit('stratReady', {start: candle.start});
            }
        } else {
            this.check(candle);
        }

        // Emit a stratUpdate event here?
    }

    addIndicator(name, type, params) {
        try {
            let indicatorPath = path.join(__dirname, '/indicators', type);
            let indicatorType = require(indicatorPath);
            let indicator = new indicatorType(params);
            this.indicators.set(name, indicator);
        } catch(err) {
            console.error(`Unable to load ${type} indicator`);
            console.error(err);
        }
    }
}

module.exports = Strategy;