const EventEmitter = require('events');

class Strategy extends EventEmitter {
    constructor(stratSettings) {
        super();

        console.log(stratSettings)

        this.age = 0;
        this.ready = false;
        this.indicators = {};
        this.requiredHistory = stratSettings.params.requiredHistory || 1;
    }

    tick(candle) {
        ++this.age;

        for(const [name, indicator] of this.indicators) {
            indicator.update(candle);
        }

        if(!this.ready) {
            if(this.age >= this.requiredHistory) {
                this.ready = true;
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