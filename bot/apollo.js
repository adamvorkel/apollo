const config = require('./config');
const server = require('./server');
const BotManager = require('./BotManager');
const Market = require('./core/markets/realtime');
const {Channels} = require('./channels');

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



const boot = async () => {

    const channels = new Channels();
    const market = new Market();

    try {
        await market.connect();
    } catch(err) {
        console.error("Failed to connect to market");
        process.exit(1);
    }

    channels.create(market, 'candle');

    const manager = new BotManager(market, channels);

    let b1 = manager.createBot(c1);
    market.subscribe(c1.watch.asset + c1.watch.currency);
    
    let b2 = manager.createBot(c2);
    market.subscribe(c2.watch.asset + c2.watch.currency);

    let b3 = manager.createBot(c3);
    market.subscribe(c3.watch.asset + c3.watch.currency);

    let b4 = manager.createBot(c4);
    market.subscribe(c4.watch.asset + c4.watch.currency);

    let b5 = manager.createBot(c5);
    market.subscribe(c5.watch.asset + c5.watch.currency);

    return manager;
};

boot().then((manager) => {
    console.log("--- Boot complete ---");
    const api = server(manager);
    setInterval(() => {
        api.broadcast('greeting', 'hello!')
    }, 2000);
});


