const EventEmitter = require('events');
const Orders = require('./orders');


class LiveBroker extends EventEmitter {
    constructor(exchange) {
        super();
        this.exchange = exchange;
        this.orders = [];
        this.portfolio = null;
    }

    async buy(params) {
        const { symbol, quantity, price } = params;
        try {
            const { id, ts } = await this.exchange.buy(symbol, quantity, price);
            const order = new Orders['limit']({ id, symbol, quantity, price, side: 'BUY', created: ts });
            this.orders.push(order);
            return order;
        } catch(err) {
            console.log(err)
            throw new Error('Unable to open position ');
        }
        
    }

    sell() {

    }

    async startSync() {
        // start update stream
        let stream = await this.exchange.getAccountStream();
        stream.on('data', data => {
            console.log("ACCOUNT ", data);
        });

        // call api every 5 seconds
        // setInterval(() => {
            // this.sync();
        // }, 5000);
    }

}

const Binance = require('../exchanges/wrappers/binance').api;
const exchange = new Binance({
    watch: {
        key: "gB8NBOByVIqXuAJxbPr266pPgpmJh4bAJz3UXg9ttBUNwde1Zt5K5kCgsd8u5193",
        secret: "YYEjznijxEqaGemsEudwIxmGVQZpI4q7XkrXD0lzL4g21djgltZmvdcyqJW4bi73",
    }
});

// const broker = new LiveBroker(exchange);
// broker.buy({ symbol: 'EOSBTC', quantity: 5, price: 0.00033 }).then(response => {
//     console.log('Created new order, response ', response);
// }).catch(err => {
//     console.log("ORDER ERROR ", err)
// })

// broker.startSync().then(d => {
//     console.log('Sync started ', d)
// });

//module.exports = LiveBroker;