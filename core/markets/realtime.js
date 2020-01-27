const Readable = require('stream').Readable;
const Heart = require('./heart');
const Fetcher = require('./fetcher');
const CandleManager = require('./candleManager');

class Realtime extends Readable {
    constructor(config) {
        super({objectMode: true});
        this.heart = new Heart(config);
        this.fetcher = new Fetcher(config);
        this.candleManager = new CandleManager();
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

        this.fetcher.on('trades', (trades) => {
            //this.candleManager.processTrades(trades);
            console.log("RECIEVED TRADESSSSS")
        });

        // this.candleManager.on('candles', (candles) => {
            //this.pushCandles(candles);
        // });

        this.heart.pump();
    }

    pushCandles(candles) {
        candles.forEach(candle => {this.push(candle)});
    }

    _read() {}

    
}

module.exports = Realtime;