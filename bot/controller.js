const {EventEmitter} = require('events');
const pipeline = require('./core/pipeline');
const exchanges = require('./exchanges');
const markets = require('./markets');
const brokers = require('./brokers');

class Controller extends EventEmitter {
    constructor(config) {
        super();
        this.config = config;

        // These are the live components
        this.exchange = new exchanges[config.watch.exchange].api(config);
        this.market = new markets.live(this.exchange);
        this.broker = new brokers.live(this.exchange);
        
        this.bots = {
            live: new Map(),
            paper: new Map()   
        }
    }

    async _createBot(config, market, broker) {
        try {
            const instance = new pipeline(config, market, broker);
            return instance;
        } catch(err) {
            console.log('Unable to create new bot...', err);
            return false;
        }
    }

    async createLiveBot(config) {
        config.id = `${config.pair}_live`;
        if(this.bots.live.has(config.id)) throw new Error(`Live bot already active for pair ${config.pair}`);
        this.bots.live.set(config.id, this._createBot(config, this.market, this.broker));
    }

    async createPaperBot(config) {
        config.id = `${config.pair}_paper_${Date.now()}`;
        this.bots.paper.set(config.id, this._createBot(config, this.market, this.broker));
    }
}

module.exports = Controller;