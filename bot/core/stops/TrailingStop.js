const {EventEmitter} = require('events');

class TrailingStop extends EventEmitter {
    constructor(price, trail) {
        super();
        this.trail = trail;
        this.stop = price * (1 - trail / 100);
        this.triggered = false;
        console.log(`Creating trailing stop with trail ${trail}`);
        console.log(`Current price ${price}, stop ${this.stop}`);
    }

    update(price) {
        if(this.triggered) return;

        if(price > this.stop / (1 - this.trail / 100)) {
            this.stop = price * (1 - this.trail / 100);
            console.log(`Current price ${price}, stop ${this.stop} -> shifting`);
        } else if(price <= this.stop) {
            console.log(`Current price ${price}, stop ${this.stop} -> trigger`);
            this.emit('trigger', {
                action: 'sell'
            });
            this.triggered = true;
        } else {
            console.log(`Current price ${price}, stop ${this.stop} -> nothing`);
        }
        
    }
}

module.exports = TrailingStop;