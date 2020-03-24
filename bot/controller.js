const {EventEmitter} = require('events');
const botManager = require('./botManager');
const backtestManager = require('./BacktestManager');
const market = require('./markets');
const brokers = require('./brokers');

class Controller extends EventEmitter {
    constructor(config) {
        super();
        this.config = config;
        this.exchange = config.watch.exchange;

        this.market;

        this.realtimeBots;
        this.paperBots;
        this.backtestBots;

        this.setup();
    }

    setup() {
        // check exchange is supported
        if(!(this.exchange in brokers)) {
            throw new Error(`Unsupported exchange ${this.exchange}`)
        }

        this.market = new market.realtime();
        this.broker = new brokers[this.exchange](this.config);

        let mockBroker = {};
        
        this.realtimeBots = new botManager('realtime', this.market, this.broker);
        this.paperBots = new botManager('paper', this.market, mockBroker);
        this.backtestBots = new backtestManager();
    }

    createBot(config) {
        const mode = config.mode;
        try {
            switch(mode) {
                case 'realtime': {
                    if(this.realtimeBots.exists(config)) {
                        const existingBotID = this.realtimeBots.generateID(config);
                        throw new Error(`${existingBotID} bot instance already active - unable to create another instance`);
                    }
                    return this.realtimeBots.create(config);
                }
                case 'paper': 
                    return this.paperBots.create(config);
                case 'backtest':
                    return this.backtestBots.create(config);
            } 
        } catch(error) {
            console.error(error.message);
        }
    }

    getState() {
        let realtimeBots = this.realtimeBots.list();
        let paperBots = this.paperBots.list();
        return {
            'realtime': realtimeBots,
            'paper': paperBots
        };
    }

    getTicker() {
        
    }
}

module.exports = Controller;