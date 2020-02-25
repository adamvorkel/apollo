const EventEmitter = require('events');

class Strategy extends EventEmitter {
    constructor(stratSettings) {
        super();

        console.log(stratSettings)

        this.age = 0;
        this.ready = false;
        this.indicators = new Map();
        this.requiredHistory = stratSettings.params.requiredHistory || 1;
    }

    tick(candle) {
        ++this.age;

        this.indicators.forEach((indicator, name) => {
            indicator.update(candle);
        });

        console.log(`I need ${this.requiredHistory} candles, I have ${this.age} so far.`)

        if(!this.ready) {
            if(this.age >= this.requiredHistory) {
                this.ready = true;
                console.log(`I am now ready!`)
                this.emit('stratReady');
            }
        } else {
            this.check(candle);
        }
    }

    calculateIndicators(candle) {
        
    }

    check(candle) {
        throw new Error(`check(candle) must be implemented in the strategy`);
    }
}

module.exports = Strategy;