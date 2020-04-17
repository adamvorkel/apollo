class Live {
    constructor(exchange) {
        this.exchange = exchange;
        this.connections = new Map();
        this.tickers = new Map();

        // this.startTicker();
    }

    async startTicker() {
        let endpoint = '!ticker@arr';
        let connection = this.exchange.getConnection();
        this.connections.set("tickers", connection);
        let tickerStream = await connection.getStream(endpoint);
        tickerStream.on('data', tickers => {
            console.log("TICKERS", tickers.length);
        });
    }

    getTickers() {

    }

    // async getKlineStream(pair) {
    //     if(!this.connections.has(pair)) 
    //         this.connections.set(pair, this.exchange.getConnection());

    //     let connection = this.connections.get(pair);
    //     let klineStream = await connection.getKlineStream(pair);

    //     return klineStream;
    // }
}

const Binance = require('../exchanges/wrappers/binance').api;
const exchange = new Binance({
    watch: {
        key: "gB8NBOByVIqXuAJxbPr266pPgpmJh4bAJz3UXg9ttBUNwde1Zt5K5kCgsd8u5193",
        secret: "YYEjznijxEqaGemsEudwIxmGVQZpI4q7XkrXD0lzL4g21djgltZmvdcyqJW4bi73",
    }
});

const market = new Live(exchange);

let ts = Date.now();
let candleInterval = 5;
let requiredHistory = 5;

let endTime = new Date(ts);
let minElapsedSinceHourStart = endTime.getMinutes();
let lastCandleStartMin = Math.floor(minElapsedSinceHourStart / candleInterval) * candleInterval;
endTime.setMinutes(lastCandleStartMin, 0, 0); // start of hour

console.log(endTime.toLocaleString())

let history = requiredHistory * candleInterval * 60 * 1000;
let startTimeTS = endTime.getTime() - history;
let startTime = new Date(startTimeTS);

console.log(startTime.toLocaleString())


// let  = startTime.setSeconds(0, 0);
// console.log(startTime.toLocaleString());

// console.log(startTime.toLocaleString());

// market.exchange.klines({symbol: 'EOSBTC', interval: '5m'});

module.exports = Live;