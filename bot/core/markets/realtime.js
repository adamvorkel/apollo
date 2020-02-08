const Readable = require('stream').Readable;
const BinanceWS = require('./exchange/wrappers/binanceWS');

let lastReq = 0;

class Realtime extends Readable {
    constructor(config) {
        super({objectMode: true});

        this.dataProvider = new BinanceWS();
        this.ws = null;
        this.activeSubs = [];
        this.pendingSubs = [];
        this.connection = null;
    }
    
    async connect() {
        //connection already open, do nothing
        if(this.ws !== null)
            return;

        // establish the fresh ws connection
        try {
            this.ws = await this.dataProvider.onCombinedStream();

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
            process.exit(1);
        }
    }

    // return promise, resolves once subscription is successful
    async subscribe(id, pair, candleSize) {
        const streamsStrings = this.dataProvider.streams;

        const pendingSub = {
            id: id,
            pair: pair,
            candleSize: candleSize
        };

        if(this.ws === null)
            await this.connect();


        //bookkeeping for establishing subscriptions
        this.pendingSubs.push(pendingSub);

        this.ws.send(JSON.stringify({
            method: "SUBSCRIBE",
            params: [streamsStrings.kline(pendingSub.pair, pendingSub.candleSize)],
            id: pendingSub.id
        }));

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
            return this.pushCandle(payload);

        if(isSubConfirm(payload))
            return this.processSubConfirm(payload.id);

        // this is not candle data
        //TODO: Emit as some sort of update event
        console.log("NON-CANDLE DATA FROM MARKET:");
        console.log(payload);
    }

    pushCandle(payload) {
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
        this.push(candle);
    }

    processSubConfirm(reqId) {
        //find relevent pending subscription and pair it relates to
        const pendingSubIndex = this.pendingSubs.findIndex(({id}) => id === reqId);
        const pendingSub = this.pendingSubs[pendingSubIndex];
        const newSub = {
            pair: pendingSub.pair, 
            candleSize: pendingSub.candleSize
        };

        // add to subscribed pairs, 
        this.activeSubs.push(newSub);
        //remove from pending queue
        this.pendingSubs.splice(pendingSubIndex, 1);

        // emit subscription confirmation, something like:
        this.emit('subComplete', newSub);
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