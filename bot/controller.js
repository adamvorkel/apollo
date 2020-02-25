const {EventEmitter} = require('events');
const botManager = require('./botManager');
const backtestManager = require('./BacktestManager');
const market = require('./markets/realtime');


class Controller extends EventEmitter {
    constructor(config) {
        super();
        this.accountStream = null;
        this.market = new market();
        this.bots = new botManager();
        this.backtests = new backtestManager();

        this.backtests.on('backtestComplete', results => {
            this.emit('event', {type: 'backtestComplete', payload: results});
        })
    }

    createBot(config) {
        const pair = `${config.watch.asset}${config.watch.currency}`;

        try {
            // Create the new bot
            let newBot = this.bots.create(config);
            // Get a pair stream for the new bot
            let stream = this.market.getStream(pair);
            // Connect the stream to the new bot
            stream.pipe(newBot);
        } catch(err) {
            console.log(`Failed to create a bot for pair ${pair}`, err);
            return;
        }
    }

    async createBacktest(config) {
        let backtestProcess = await this.backtests.create(config);
    }
}

module.exports = Controller;