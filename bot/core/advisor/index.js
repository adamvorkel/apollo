const EventEmitter = require('events');
// this.klines.pipe(new CandleBatcher(this.config.))
const CandleBatcher = require('../../exchanges/candleBatcher');

class Advisor extends EventEmitter {
    constructor(config, market) {
        super();
        this.config = config;
        this.strategy = null;
        this.batcher = null;

        this.loadStrategy(config);
    }

    loadStrategy({ strategy }) {
        const { name, params } = strategy;
        try {
            let c = require(`./strategies/${name}`);
            this.strategy = new c(params);
            this.strategy.meta = strategy;
            this.strategy.on("stratReady", () => this.emit("stratReady"));
            this.strategy.on("stratUpdate", update => this.emit("stratUpdate", update));
            this.strategy.on("advice", advice => this.emit("advice", advice));

            // create correct batcher for strategy 
            this.batcher = new CandleBatcher(params.candleSize);
            this.batcher.on('data', candle => this.strategy.tick(candle));
        } catch(err) {
            console.log(err.message)
            throw new Error(`Unable to load strategy ${name}`);
        }
    }


    processCandle(candle) {
        this.batcher.write(candle);
    }
}

module.exports = Advisor;