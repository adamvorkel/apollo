const {EventEmitter} = require('events');
const {Channels} = require('./channels');
const botManager = require('./botManager');
const backtestManager = require('./BacktestManager');
const market = require('./markets/realtime');


class Controller extends EventEmitter {
    constructor(config) {
        super();
        this.channels = new Channels();
        this.accountStream = null;
        this.market = new market();
        this.bots = new botManager(this.channels);
        this.backtests = new backtestManager();

        this.backtests.on('backtestComplete', results => {
            this.emit('event', {type: 'backtestComplete', payload: results});
        })
    }

    async connectToMarket() {
        try {
            await this.market.connect();
        } catch(err) {
            process.exit(1);
        }
        this.channels.create(this.market, 'candle');
    }

    createBot(config) {
        const pair = `${config.watch.asset}${config.watch.currency}`;

        let newBot = this.bots.create(config);

        this.market.subscribe(config.watch.asset + config.watch.currency);
        this.channels.subscribe(newBot.candle.bind(newBot), 'candle', pair);
    }

    createBacktest(config) {
        this.backtests.create(config);
    }
}

module.exports = Controller;