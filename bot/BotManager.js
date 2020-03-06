/**
 * 
 * Manages intances of bots
 * 
 */
const pipeline = require('./core/pipeline');
const advisor = require('./core/advisor');
const trader = require('./core/trader');

const broker = require('./core/broker');

class BotManager {
    constructor(mode, market) {
        this.bots = new Map();
        this.broker = broker({mode: 'realtime'});
        this.create = this.create.bind(this);
        this.market = market;
        this.mode = mode;
    }

    create(config) {
        const pair = `${config.watch.asset}${config.watch.currency}`;
        const mode = this.mode;
        const id = `${pair}-${mode}`;
        
        let advisorInstance = new advisor(config);
        let traderInstance = new trader[mode](config);
        
        // create new bot & pipe candle stream
        let newBot = new pipeline(config, advisorInstance, traderInstance);
        let stream = this.market.getStream(pair);
        
        stream.pipe(newBot);

        this.bots.set(id, {
            pair: pair,
            startTime: Date.now(),
            instance: newBot
        });
        
        return newBot;
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