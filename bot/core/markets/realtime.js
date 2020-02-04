const Readable = require('stream').Readable;
const Heart = require('./heart');
const Fetcher = require('./fetcher');
const BinanceWS = require('./exchange/wrappers/binanceWS');
const CandleManager = require('./candleManager');

class Realtime extends Readable {
    constructor(config) {
        super({objectMode: true});
        this.heart = new Heart(config);
        this.fetcher = new Fetcher(config);
        this.candleManager = new CandleManager();
        this.setupStream();
        this.ws;
        this.lastCandle = 0;
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
            // this.fetcher.fetch();
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

    setupStream() {
        this.ws = new BinanceWS();
        this. ws.onKline("BTCUSDT", "1m", (payload) => {
            let res = JSON.parse(payload);
            let kline = res.k;

            let candle = {
                isClosed: kline.x,
                time: res.E,
                start: kline.t,
                open: kline.o,
                close: kline.c,
                high: kline.h,
                low: kline.l,
                trades: kline.n,
                volume: kline.v
            };

            if(candle.start > this.lastCandle.start) {
                this.push(this.lastCandle);
            }

            this.lastCandle = candle;
            
        });
    }

    
}

module.exports = Realtime;