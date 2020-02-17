/**
 * 
 * Manages intances of bots
 * 
 */
const pipeline = require('./core/pipeline');


class BotManager {
    constructor(channels) {
        this.channels = channels;
        this.bots = new Map();
        this.create = this.create.bind(this);
    }

    create(config) {
        const pair = `${config.watch.asset}${config.watch.currency}`;
        const mode = config.mode;
        const id = `${pair}-${mode}`;

        const advisor = require('./core/advisor');
        const trader = require('./core/trader');

        // create new bot
        let newBot = new pipeline(config, new advisor(config), new trader(config));

        
        this.bots.set(id, newBot);
        return newBot;
    }
}

module.exports = BotManager;