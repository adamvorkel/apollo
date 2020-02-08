const EventEmitter = require('events');

class TradingAdvisor extends EventEmitter {
    constructor(config) {
        super();
        this.strategy = null;
        this.config = config;

        this.setup();
        this.lastCandleTime;
    }

    setup() {
        this.strategy = this.loadStrategy(this.config.strategy);
        this.strategy.on("stratWarmup", () => {this.emit("stratWarmup")});
        this.strategy.on("stratUpdate", update => this.emit("stratUpdate", update));
        this.strategy.on("advice", advice => this.emit("advice", advice));
    }

    loadStrategy(config) {
        let strategy;
        try {
            strategy = require('./strategies/' + config.name);
        } catch(err) {
            throw new Error(`Unable to load strategy ${config.name}`);
        }

        return new strategy(config.params);
    }

    processCandle(candle) {
        let output = `candle - Open: ${candle.open} | Close: ${candle.close} | Movement: ${candle.close - candle.open}`;
        if(this.lastCandleTime) {
            output += " | elapsed: " + ((candle.start - this.lastCandleTime) / 1000) + " s";
        }

        this.lastCandleTime = candle.start;

        console.log(candle);
    }
}

module.exports = TradingAdvisor;