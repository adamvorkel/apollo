const EventEmitter = require('events');

class Advisor extends EventEmitter {
    constructor(config) {
        super();
        this.strategy = null;
        this.config = config;
        this.name = this.config.strategy.name;

        this.setup();
    }

    setup() {
        this.loadStrategy(this.config.strategy);
        this.strategy.on("stratReady", () => {this.emit("stratReady")});
        this.strategy.on("stratUpdate", update => this.emit("stratUpdate", update));
        this.strategy.on("advice", advice => this.emit("advice", advice));
    }

    loadStrategy(stratSettings) {
        let strategy;
        try {
            strategy = require('./strategies/' + this.name);
            this.strategy = new strategy(stratSettings);
        } catch(err) {
            throw new Error(`Unable to load strategy ${this.name}`);
        }

        // // check for required methods
        // try {
        //     let requiredMethods = ['init', 'check'];
        //     requiredMethods.forEach(method => {
        //         if(!this.strategy[method])
        //             throw new Error(`Missing strategy method ${method}`);
        //     });
        //     console.log('all methods present on strategy', requiredMethods)
        // } catch(err) {
        //     console.error('Invalid strategy', err.message);
        // }

        // // create indicators
    }

    getState() {
        return {
            name: this.name,
            age: this.strategy.age,
            ready: this.strategy.ready
        };
    }

    processCandle(candle) {
        if(candle.isClosed) {
            this.strategy.tick(candle);
        }
    }
}

module.exports = Advisor;