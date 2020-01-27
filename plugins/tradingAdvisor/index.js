const path = require('path');
const EventEmitter = require('events');
const strategyConfig = require('../../config').strategy;

class TradingAdvisor extends EventEmitter {
    constructor() {
        super();
        this.strategy = null;
        this.setup(strategyConfig);
        this.lastCandleTime;
    }

    setup(config) {
        this.strategy = this.loadStrategy(config);
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

        console.log(output);
    }
}

module.exports = TradingAdvisor;