const EventEmitter = require('events');

class Strategy extends EventEmitter {
    constructor(stratSettings) {
        super();

        this.age = 0;
        this.ready = false;
        this.requiredHistory = stratSettings.params.requiredHistory || 1;
    }

    tick(candle) {
        ++this.age;

        if(!this.ready) {
            if(this.age >= this.requiredHistory) {
                this.ready = true;
                this.emit('stratReady');
            }
        } else {
            this.check(candle);
        }
    }

    check(candle) {
        throw new Error(`check(candle) must be implrmented in the strategy`);
    }
}

module.exports = Strategy;