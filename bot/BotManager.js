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
        this.create = this.create.bind(this);
        this.market = market;
        this.mode = mode;
    }

    create(config) {
        const pair = `${config.watch.asset}${config.watch.currency}`;
        const mode = this.mode;
        const id = `${pair}-${mode}`;

        if(this.bots.has(id) && this.mode === 'realtime') {
            throw new Error(`${id} bot instance already active - unable to create another instance`)
        }
        
        /**
         * A bot is a collection of:
         * - advisor: provides buy/sell advice from running strategy
         * - trader: creates buy/sell orders from advice
         * - broker: executes/monitors trades based on orders
         */
        let advisorInstance = new advisor(config);
        let traderInstance = new trader(config);
        let brokerInstance = new broker[mode](config);
        
        let newBot = new pipeline(config, advisorInstance, traderInstance, brokerInstance);

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