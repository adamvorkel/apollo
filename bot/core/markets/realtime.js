const Readable = require('stream').Readable;
const Heart = require('./heart');
const Fetcher = require('./fetcher');
const BinanceWS = require('./exchange/wrappers/binanceWS');
const CandleManager = require('./candleManager');

class Realtime extends Readable {
    constructor(config) {
        super({objectMode: true});
        // this.heart = new Heart(config);
        // this.fetcher = new Fetcher(config);
        // this.candleManager = new CandleManager();
        this.ws = new BinanceWS();
        // this.lastCandle = 0;
    }

    //remove this later
    run() {
        // this.fetcher.on('marketStart', () => {
        //     this.emit('marketStart');
        // });

        // this.fetcher.on('marketUpdate', () => {
        //     this.emit('marketUpdate');
        // });

        // this.fetcher.on('trades', trades => {
        //     this.emit('trades', trades);
        // });

        // this.heart.on('tick', () => {
        //     // this.fetcher.fetch();
        // });

        // this.fetcher.on('trades', (trades) => {
        //     //this.candleManager.processTrades(trades);
        //     console.log("RECIEVED TRADESSSSS")
        // });


        // // this.candleManager.on('candles', (candles) => {
        //     //this.pushCandles(candles);
        // // });

        // this.heart.pump();
    }

    pushCandles(candles) {
        candles.forEach(candle => {this.push(candle)});
    }

    _read() {}

    subscribe(pairs) {
        const streamsStrings = this.ws.streams;

        const streams = pairs.map(pair => {
            return streamsStrings.kline(pair, '1m');
        });

        console.log(streams);

        return this.ws.onCombinedStream(streams, payload => {
            let res = JSON.parse(payload);
            this.push(res);
        })


        // this.ws.onKline(pair, "1m", (payload) => {
        //     let res = JSON.parse(payload);
        //     let kline = res.k;

        //     let candle = {
        //         isClosed: kline.x,
        //         time: res.E,
        //         start: kline.t,
        //         open: kline.o,
        //         close: kline.c,
        //         high: kline.h,
        //         low: kline.l,
        //         trades: kline.n,
        //         volume: kline.v
        //     };

        //     if(candle.start > this.lastCandle.start) {
        //         this.push(this.lastCandle);
        //     }

        //     this.lastCandle = candle;
        // });

    }


    
}

module.exports = Realtime;