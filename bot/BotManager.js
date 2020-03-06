/**
 * 
 * Manages intances of bots
 * 
 */
const pipeline = require('./core/pipeline');
const advisor = require('./core/advisor');
const trader = require('./core/trader');

class BotManager {
    constructor() {
        this.bots = new Map();
        this.create = this.create.bind(this);
    }

    create(config) {
        const pair = `${config.watch.asset}${config.watch.currency}`;
        const mode = config.mode;
        const id = `${pair}-${mode}`;
        

        let advisorInstance = new advisor(config);
        let traderInstance = trader(config);

        // create new bot
        let newBot = new pipeline(config, advisorInstance, traderInstance);
        this.bots.set(id, newBot);
        return newBot;
    }
}

module.exports = BotManager;