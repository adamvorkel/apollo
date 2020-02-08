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
            const percentWarmedUp = (this.age / this.requiredHistory) * 100;
            console.log(`${percentWarmedUp}% warmed up...`)
            if(this.age >= this.requiredHistory) {
                console.log("Emitting ready")
                this.ready = true;
                this.emit('stratReady');
            }
        } else {
            console.log("Strategy ready " + candle.close);
        }
    }
}

module.exports = Strategy;