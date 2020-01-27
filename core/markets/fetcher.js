const EventEmitter = require('events');
const BinanceWrapper = require('./exchange/wrappers/binance');

class Fetcher extends EventEmitter {
    constructor(config) {
        super();
        this.marketStarted = false;
        this.last = -1;
        this.exchangeName = config.watch.exchange;
        // load exchange
        this.exchange = new BinanceWrapper(config);
        this.pair = `${config.watch.currency}/${config.watch.asset}`;
    }

    fetch() {
        // let since = Date.UTC(2020, 0, 24, 17, 0, 0);
        // this.exchange.getTrades(since)
        this.exchange.getTrades()
        .then(trades => {
            return this.processTrades(trades)
        })
        .then(trades => {
            //update last
            this.last = trades.last.tid;
            return this.relayTrades(trades);
        })
        .catch(error => {console.log(`ERROR: ${error}`)});
    }

    processTrades(trades) { 
        let filtered;

        //remove 0 quantity trades
        filtered = trades.filter(trade => {
            return trade.quantity > 0;
        });

        //remove known trades
        filtered = trades.filter(trade => {
            return trade.tid > this.last;
        });

        console.log(`LastTid: ${this.last} | Filtered out ${trades.length - filtered.length} known trades`);

        let first = filtered[0];
        let last = filtered[filtered.length - 1];

        let batch = {
            amount: filtered.length,
            start: first.date, 
            end: last.date,
            first: first,
            last: last,
            data: filtered
        };

        return batch;
    }

    relayTrades(batch) {
        if(!this.marketStarted) {
            this.emit('marketStarted', batch.first.date);
            this.marketStarted = true;
        }
            
        this.emit('marketUpdate', batch.last.date);
        this.emit('trades', batch);
    }
}

module.exports = Fetcher;