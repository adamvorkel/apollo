const Readable = require('stream').Readable;
const Heart = require('./heart');
const Fetcher = require('./fetcher');
const BinanceWS = require('./exchange/wrappers/binanceWS');
const CandleManager = require('./candleManager');
const WebSocket = require('ws');

let lastReq = 0;

class Realtime extends Readable {
    constructor(config) {
        super({objectMode: true});
        this.dataProvider = new BinanceWS();
        this.pairs = [];
        this.ws = null;
        this.pendingSubscriptions = [];
    }


    
    async connect(pairs = []) {
        const streamsStrings = this.dataProvider.streams;
        //connection already open, do nothing
        if(this.ws !== null)
            return;
        
        pairs.forEach(pair => {
            this.pairs.push(pair);
        });

        //create initial request string for ws connection url
        const streams = pairs.map(pair => {
            return streamsStrings.kline(pair, '1m');
        });

        // establish the fresh ws connection
        try {
            this.ws = await this.dataProvider.onCombinedStream(streams);

            pairs.forEach(pair => {
                this.emit('subComplete', pair);
            })

            this.ws.on('message', message => {
                this.handleMessage(message);
            });
            this.ws.on('error', error => {
                throw new Error("Websocket error!!!")
            });
            this.ws.on('close', () => {
                console.log("Websocket closed");
            });
        } catch(err) {
            console.error("WebSocket connection failure");
            console.log(err)
            process.exit(1);
        }
    }

    // return promise, resolves once subscription is successful
    async subscribe(pair) {
        const streamsStrings = this.dataProvider.streams;

        if(this.ws === null) {
            await this.connect([pair]);
        } else {
            const reqID = ++lastReq;

            //bookkeeping for establishing subscriptions
            this.pendingSubscriptions.push({id: reqID, pair: pair});

            this.ws.send(JSON.stringify({
                method: "SUBSCRIBE",
                params: [streamsStrings.kline(pair, "1m")],
                id: reqID
            }));
        }
    }

    handleMessage(message) {
        const isCandle = (m) => {
            return m.data !== undefined && m.data.e == 'kline';
        };

        const isSubConfirm = (m) => {
            return m.result === null && m.id !== undefined && Number.isInteger(m.id);
        };

        const payload = JSON.parse(message);

        // check if this is a candle -> process and push candle
        if(isCandle(payload)) 
            return this.processCandle(payload);

        if(isSubConfirm(payload))
            return this.processSubConfirm(payload.id);

        // this is not candle data
        //TODO: Emit as some sort of update event
        console.log("NON-CANDLE DATA FROM MARKET:");
        console.log(payload);
    }

    processCandle(payload) {
        //create candle object in format that bots can consume
        const kline = payload.data.k;
        const time = payload.data.E;
        const candle = {
            pair: kline.s,
            isClosed: kline.x,
            time: time,
            start: kline.t,
            open: kline.o,
            close: kline.c,
            high: kline.h,
            low: kline.l,
            trades: kline.n,
            volume: kline.v
        }
        this.emit(`${candle.pair}_candle`, candle);
        this.pushCandle(candle);
    }

    pushCandle(candle) {
        this.push(candle);
    }

    processSubConfirm(reqId) {
        //find relevent pending subscription and pair it relates to
        const pendingSubIndex = this.pendingSubscriptions.findIndex(({id}) => id === reqId);
        const pendingSub = this.pendingSubscriptions[pendingSubIndex];
        const pendingSubPair = pendingSub.pair;

        // add to subscribed pairs, remove from pending queue
        this.pairs.push(pendingSubPair);
        this.pendingSubscriptions.splice(pendingSubIndex, 1);

        // emit subscription confirmation, something like:
        this.emit('subComplete', pendingSubPair);
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

    _read() {}


    
}

module.exports = Realtime;