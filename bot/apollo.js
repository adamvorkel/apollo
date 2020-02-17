const config = require('./config');
const server = require('./server');
const BotManager = require('./BotManager');
const Market = require('./core/markets/realtime');
const {Channels} = require('./channels');
const {EventEmitter} = require('events');
const pipeline = require('./core/pipeline');
const { fork } = require('child_process');

// Create a bot instance for dev/testing
// remove later
let c1  = {
    mode: "realtime",
    watch: {
        currency: "USDT",
        asset: "BTC",
    },
    advisor: {
        strategy: {
            name: 'myStrategy',
            params: {requiredHistory: 5}
        }
    },
    
};

let c2  = {
    mode: "realtime",
    watch: {
        currency: "BTC",
        asset: "BNB",
    },
    advisor: {
        strategy: {
            name: 'myStrategy',
            params: []
        }
    },
};

let c3  = {
    mode: "realtime",
    watch: {
        currency: "BTC",
        asset: "EOS",
    },
    advisor: {
        strategy: {
            name: 'myStrategy',
            params: []
        }
    },
};

let c4  = {
    mode: "paper",
    watch: {
        currency: "BTC",
        asset: "EOS",
    },
    advisor: {
        strategy: {
            name: 'myStrategy',
            params: []
        }
    },
};

let c5  = {
    mode: "paper",
    watch: {
        currency: "BTC",
        asset: "XRP",
    },
    advisor: {
        strategy: {
            name: 'myStrategy',
            params: []
        }
    },
};

let c6  = {
    mode: "backtest",
    watch: {
        currency: "BTC",
        asset: "ETH",
    },
    daterange: {
        from: '',
        to: ''
    },
    advisor: {
        strategy: {
            name: 'myStrategy',
            params: []
        }
    },
};



class BacktestManager extends EventEmitter {
    constructor() {
        super();
        this.backtests = new Map();
    }

    create(config) {
        const daterange = `${config.daterange.to}-${config.daterange.from}`;
        const pair = `${config.watch.asset}${config.watch.currency}`
        const backtestProcess = fork(__dirname + '/workers/backtest.js');
        backtestProcess.on('message', message => {
            switch(message.type) {
                case 'status': {
                    if(message.payload === 'ready') {
                        console.log('Got a message from the child backtest process ' + message.payload)
                        this.emit('backtestStart', {timestamp: 123});
                        backtestProcess.send({task: 'start', config: config});
                    } else if(message.payload === 'done') {
                        this.emit('backtestComplete', {results: 'poop'});
                        backtestProcess.send({task: 'exit'});
                    }
                }
                case 'error': {
                    this.emit('backtestError', message.payload);
                }
            }
        });
    }
}

class Controller extends EventEmitter {
    constructor(config) {
        super();
        this.channels = new Channels();
        this.accountStream = null;
        this.marketStream = new Market();
        this.bots = new BotManager(this.channels);
        this.backtests = new BacktestManager();

        this.backtests.on('backtestComplete', results => {
            this.emit('event', {type: 'backtestComplete', payload: results});
        })
    }

    async connectToMarket() {
        try {
            await this.marketStream.connect();
        } catch(err) {
            process.exit(1);
        }
        this.channels.create(this.marketStream, 'candle');
    }

    createBot(config) {
        const pair = `${config.watch.asset}${config.watch.currency}`;
        let newBot = this.bots.create(config);
        this.marketStream.subscribe(config.watch.asset + config.watch.currency);
        this.channels.subscribe(newBot.candle.bind(newBot), 'candle', pair);
    }

    createBacktest(config) {
        this.backtests.create(config);
    }


}

const boot = async (config) => {
    let controller = new Controller(config);

    await controller.connectToMarket();
    
    // let b1 = controller.createBot(c1);
    // let b2 = controller.createBot(c2);
    // let b3 = controller.createBot(c3);
    // let b4 = controller.createBot(c4);
    // let b5 = controller.createBot(c5);
    let b6 = controller.createBacktest(c6);

    return controller;
};

boot(config).then((controller) => {
    console.log("--- Boot complete ---");
    const api = server(controller);

    controller.on('event', event => {
        console.log(`${event.type} event occured, push to clients`);
        api.broadcast(event.type, event.payload);
    })
});


