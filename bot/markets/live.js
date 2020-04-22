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

    getTickerStream(pair) {
        return this.exchange.getTickerStream(pair)
    }

    getKlineStream(pair) {
        return this.exchange.getKlineStream(pair)
    }

    async getKlines(symbol, interval, endTime, history) {
        /**
         * 
         */
        console.log(symbol)
        
        let end = new Date(endTime);
        console.log(`End: ${end.toLocaleString()}`)
        let mins = end.getMinutes();
        let endCandleStart = Math.floor(mins / interval) * interval;
        let lastClosedCandle = endCandleStart - interval;
        end.setMinutes(lastClosedCandle, 0, 0);
        let endTS = end.getTime();

        let historyMS = (history - 1) * interval * 60 * 1000;
        let startTS = endTS - historyMS;

        
        console.debug(`Getting ${interval}m candles from ${(new Date(startTS).toLocaleString())} to ${(new Date(endTS).toLocaleString())}`);

        let reqParams = {
            symbol: symbol,
            interval: `${interval}m`,
            startTime: startTS,
            endTime: endTS
        };

        try {
            let klines = await this.exchange.klines(reqParams);
            klines = klines.map(kline => {
                return {
                    pair: symbol,
                    start: kline[0],
                    open: parseFloat(kline[1]),
                    close: parseFloat(kline[4]),
                    high: parseFloat(kline[2]),
                    low: parseFloat(kline[3]),
                    trades: parseInt(kline[8]),
                    volume: parseFloat(kline[5])
                };
            })
            return klines;
        } catch(err) {
            console.log(err)
            throw new Error(`Error getting klines: ${err.message}`)
        }
    }

    
}

// const Binance = require('../exchanges/wrappers/binance').api;
// const exchange = new Binance({
//     watch: {
//         key: "gB8NBOByVIqXuAJxbPr266pPgpmJh4bAJz3UXg9ttBUNwde1Zt5K5kCgsd8u5193",
//         secret: "YYEjznijxEqaGemsEudwIxmGVQZpI4q7XkrXD0lzL4g21djgltZmvdcyqJW4bi73",
//     }
// });


// /**
//  * Testing stuff
//  */

// const market = new Live(exchange);


// let symbol = 'BTCUSDT';
// let now = Date.now();
// let interval = 5;
// let history = 25;

// market.getKlines(symbol, interval, now, history)
// .then(klines => {
//     console.log(`Recieved ${klines.length} klines`);
//     const BB = require('../core/advisor/indicators/bbands');
//     const EMA = require('../core/advisor/indicators/sma');
//     const myBB = new BB({period: 25, stddevs: 2});
//     const myEMA = new EMA({period: 25});
//     klines.forEach(kline => {
//         myEMA.update(kline);
//         myBB.update(kline);
//     });
//     console.log(`myBB final result: ${myBB.result}, age ${myBB.age}`);
//     console.log(`myEMA final result: ${myEMA.result}, age ${myEMA.age}`);
// })
// .catch((err) => {
//     console.log("ERRRRR ", err.message)
// })












// let  = startTime.setSeconds(0, 0);
// console.log(startTime.toLocaleString());

// console.log(startTime.toLocaleString());

// market.exchange.klines({symbol: 'EOSBTC', interval: '5m'});

module.exports = Live;