/**
 * 
 * Manages intances of bots
 * 
 */
const pipeline = require('./core/pipeline');


class BotManager {
    constructor() {
        this.bots = new Map();
        this.create = this.create.bind(this);
    }

    create(config) {
        const pair = `${config.watch.asset}${config.watch.currency}`;
        const mode = config.mode;
        const id = `${pair}-${mode}`;

        const advisor = require('./core/advisor');

        let trader;
        switch(mode) {
            case 'realtime': 
                trader = require('./core/trader');
                break;
            case 'paper':
                trader = require('./core/paperTrader');
                break;
            default: 
                console.error(`Invalid mode: ${mode}, unable to create bot...`);
                return;
        }

        // create new bot
        let newBot = new pipeline(config, new advisor(config), new trader(config));
        this.bots.set(id, newBot);
        return newBot;

    }
}

module.exports = BotManager;