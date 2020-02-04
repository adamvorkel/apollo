const EventEmitter = require('events');

class Heart extends EventEmitter {
    constructor(config) {
        super();
        this.tickrate = config.watch.tickrate * 1000;
        this.lastTick = false;
    }

    pump() {
        setTimeout(() => {
            this.tick();
            setInterval(() => {
                this.tick();
            }, this.tickrate);
        }, 0);
    }

    tick() {
       if(this.lastTick) {
           if(this.lastTick < Date.now() - (this.tickrate * 3)) {
               console.log("Failed to tick in time");
           }
       } 

       this.lastTick = Date.now();
       
       this.emit("tick");
    }
}

module.exports = Heart;