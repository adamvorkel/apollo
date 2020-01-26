const EventEmitter = require('events');
const BinanceWrapper = require('./exchange/wrappers/binance');

class Fetcher extends EventEmitter {
    constructor(config) {
        super();
        this.marketStarted = false;
        this.exchangeName = config.watch.exchange;
        // load exchange
        this.exchange = new BinanceWrapper(config);
        this.pair = `${config.watch.currency}/${config.watch.asset}`;
    }

    fetch() {
        let since = Date.UTC(2020, 0, 24, 17, 0, 0);
        this.exchange.getTrades(since).then((trades) => this.processTrades(trades));
    }

    processTrades(trades) {
        //this.batcher.write 
        this.writeBatcher(trades);
    }
    

    writeBatcher(trades) {
        //assuming we've batched only new trades
        this.relayTrades(trades);
    }

    relayTrades(batch) {
        if(!this.marketStarted)
            this.emit('marketStarted', batch);
        this.emit('marketUpdate', batch);
        this.emit('trades', batch);
    }
}

module.exports = Fetcher;