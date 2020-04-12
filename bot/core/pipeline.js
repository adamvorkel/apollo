const advisor = require('./advisor');
const trader = require('./trader');
const analyzer = require('./analyzer');
const pluginManager = require('./pluginManager');

/**
 * A bot is a pipeline of:
 * - advisor: provides buy/sell advice from running strategy
 * - trader: creates/monitors orders based on advice
 * - plugins: a plugin manager allows loading of plugins for additional functionality
 */

class pipeline {
    constructor(config, exchange) {
        this.config = config;
        
        this.klines = exchange.getKlineStream(config.pair);
        this.priceTicker = exchange.getPriceTicker(config.pair);
        this.advisor = new advisor(config);
        this.trader = new trader(config, exchange);
        this.analyzer = new analyzer(config);
        this.plugins = new pluginManager(config);

        this._setup();
    }

    _setup() {
        this.klines.on('data', candle => {
            console.log('Kline stream data ', candle)
            this.advisor.processCandle(candle);
            this.plugins.processCandle(candle);
        });
        this.priceTicker.on('data', tick => {
            console.log('Price Ticker stream data ', tick);
            this.trader.processTick(tick);
        });
        this.advisor.on('advice', this.trader.processAdvice);
    }

    _finalize() {
        this.plugins.finalize();
    }
}

module.exports = pipeline;