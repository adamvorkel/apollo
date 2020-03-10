/**
 * 
 * Manages bot instances
 * 
 */

const pipeline = require('./core/pipeline');


class BotManager {
    constructor(mode, market, broker) {
        this.bots = new Map();
        this.create = this.create.bind(this);
        this.mode = mode;
        this.market = market;
        this.broker = broker;
    }

    create(config) {
        const id = this.generateID(config);
        const pair = `${config.watch.asset}${config.watch.currency}`;
        
        // this gets injected (different depending on mode)
        let brokerInstance = {};
        // let brokerInstance = new broker[mode](config);

        let newBot = new pipeline(config, brokerInstance);

        // pipe candle stream
        let stream = this.market.getStream(pair);
        stream.pipe(newBot);

        this.bots.set(id, {
            pair: pair,
            startTime: Date.now(),
            instance: newBot
        });
        
        return newBot;
    }

    exists(config) {
        const id = this.generateID(config);
        return this.bots.has(id);
    }

    generateID(config) {
        const pair = `${config.watch.asset}${config.watch.currency}`;
        const id = `${pair}-${this.mode}`;
        return id;
    }

    list() {
        let list = [];

        this.bots.forEach((bot, id) => {
            const {pair, startTime, instance} = bot;
            const strategy = instance.advisor.getState();
            list.push({
                id, 
                startTime, 
                pair, 
                strategy
            });
        });

        return list;
    }
}

module.exports = BotManager;