const Readable = require('stream').Readable;
const Heart = require('./heart');
const Fetcher = require('./fetcher');
const BinanceWS = require('./exchange/wrappers/binanceWS');
const CandleManager = require('./candleManager');
const WebSocket = require('ws');

class Realtime extends Readable {
    constructor(config) {
        super({objectMode: true});
        // this.heart = new Heart(config);
        // this.fetcher = new Fetcher(config);
        // this.candleManager = new CandleManager();
        this.dataProvider = new BinanceWS();
        this.pairs = [];
        this.ws = null;
        // this.lastCandle = 0;
    }


    // return promise, resolves once subscription is successful
    subscribe(pairs) {
        const streamsStrings = this.dataProvider.streams;

        if(pairs.length) {
            this.pairs.push(...pairs);
        }

        return new Promise((resolve, reject) => {
            if(this.ws) {
                const reqID = 4
                const req = {
                    method: "SUBSCRIBE",
                    params: [
                        streamsStrings.kline(pairs[0], "1m")
                    ],
                    id: reqID
                };
                this.ws.send(JSON.stringify(req));
                this.ws.on('message', message => {
                    const data = JSON.parse(message);
                    if(data.id === reqID) {
                        resolve();
                    }
                })
            } else {
                const streams = pairs.map(pair => {
                    return streamsStrings.kline(pair, '1m');
                });
                this.dataProvider.onCombinedStream(streams)
                    .then(ws => {
                        this.ws = ws;
                        ws.on('message', message => {
                            const data = JSON.parse(message);
                            this.push(data);
                        });
                        ws.on('error', error => {
                            throw new Error("Websocket error!!!")
                        });
                        ws.on('close', () => {
                            console.log("Websocket closed");
                        });
                        resolve();
                        return ws;
                    })
                    .catch(error => {
                        reject(error);
                    });
            }
        });

        

        



        // this.dataProvider.onKline(pair, "1m", (payload) => {
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
    
    
        setup() {
            
        }
    
    
        pushCandles(candles) {
            candles.forEach(candle => {this.push(candle)});
        }
    
        _read() {}


    
}

module.exports = Realtime;