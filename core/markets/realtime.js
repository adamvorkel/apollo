const EventEmitter = require('events');
const Readable = require('stream').Readable;
const path = require('path');
const ws = require('ws');

const Heart = require('./heart');

class BinanceWS {
    constructor() {

    }

    setupWebSocket(address) {
        const ws = new WebSocket(address);
        ws.on('message', (message) => {

        })
    }

}

class Binance {
    constructor(config) {

    }
}

class Fetcher extends EventEmitter {
    constructor(config) {
        super();
        this.marketStarted = false;
        this.exchange = config.watch.exchange;
        // load exchange
        this.trader = new Binance(config);
        this.pair = `${config.watch.currency}/${config.watch.asset}`;
    }

    

    fetch() {
        setTimeout(() => {
            //here we assume we've gotten some candles back
            let newTrades = [
                {tid: 1, price: 10, date: "", amount: 12},
                {tid: 2, price: 10, date: "", amount: 12},
                {tid: 3, price: 10, date: "", amount: 12},
                {tid: 4, price: 10, date: "", amount: 12}
            ];
            this.processTrades(newTrades);
        }, 100);
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

class Realtime extends Readable {
    constructor(config) {
        super({objectMode: true});
        this.heart = new Heart(config);
        this.fetcher = new Fetcher(config);
        this.run();
    }

    run() {
        this.fetcher.on('marketStart', () => {
            this.emit('marketStart');
        });
        this.fetcher.on('marketUpdate', () => {
            this.emit('marketUpdate');
        });
        this.fetcher.on('trades', trades => {
            this.emit('trades', trades);
        });
        this.heart.on('tick', () => {
            this.fetcher.fetch();
        });

        this.heart.pump();
    }

    
}

module.exports = Realtime;