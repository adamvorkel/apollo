const {EventEmitter} = require('events');
const botManager = require('./botManager');
const backtestManager = require('./BacktestManager');
const market = require('./core/markets');

class Controller extends EventEmitter {
    constructor() {
        super();
        this.market = new market.realtime();
        this.realtimeBots = new botManager('realtime', this.market);
        this.paperBots = new botManager('paper', this.market);
        this.backtestBots = new backtestManager();
    }

    createBot(config) {
        const mode = config.mode;
        try {
            switch(mode) {
                case 'realtime': 
                    this.realtimeBots.create(config);
                    break;
                case 'paper': 
                    this.paperBots.create(config);
                    break;
                case 'backtest':
                    this.backtestBots.create(config);
            } 
        } catch(err) {
            console.error(err);
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
}

module.exports = Controller;