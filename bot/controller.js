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
            paper: new Map(),
            backtest: new Map()    
        }
    }

    async createLiveBot(config) {
        try {
            const start = Date.now();
            let id = `${config.pair}_live`;
            if(this.bots.live.has(id)) throw new Error(`Live bot already active for pair ${config.pair}`);
            let instance = new pipeline(config, this.exchange);
            this.bots.live.set(id, {start, instance});
        } catch(error) {
            console.error(error);
        }
    }

    async createPaperBot(config) {
        try {
            const start = Date.now();
            let id = `${config.pair}_paper_${start}`;
            let instance = new pipeline(config, this.exchange/*{getPortfolio: () => {console.log('get mock portfolio vals here here')}}*/);
            this.bots.paper.set(id, {start, instance});
        } catch(error) {
            console.error(error);
        }
    }

    createBacktestBot(config) {
        // try {
        //     const start = Date.now();
        //     let id = `${config.pair}_backtest_${start}`;
        //     let portfolio = new portfolio();
        //     let instance = new pipeline(config, new markets.backtest(), new brokers.mock(portfolio));
        //     this.bots.backtest.set(id, {start, instance});
        // } catch(error) {
        //     console.error(error.message);
        // }
    }

    getTicker() {

    }
}

module.exports = Controller;