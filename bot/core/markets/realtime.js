const Readable = require('stream').Readable;
const BinanceWS = require('./exchange/wrappers/binanceWS');

let lastReq = 0;

class Realtime extends Readable {
    constructor(config) {
        super({objectMode: true});

        this.dataProvider = new BinanceWS();
        this.streams = {
            depth: (symbol) => `${symbol.toLowerCase()}@depth`,
            depthLevel: (symbol, level) => `${symbol.toLowerCase()}@depth${level}`,
            kline: (symbol, interval) => `${symbol.toLowerCase()}@kline_${interval}`,
            aggTrade: (symbol) => `${symbol.toLowerCase()}@aggTrade`,
            trade: (symbol) => `${symbol.toLowerCase()}@trade`,
            ticker: (symbol) => `${symbol.toLowerCase()}@ticker`,
            allTickers: () => '!ticker@arr'
        };
        this.ws = null;
        this.subs = [];
    }
    
    async connect() {
        // establish the fresh ws connection
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket("wss://stream.binance.com:9443/stream?streams=");

            this.ws.on('open', () => {
                resolve(ws);
            });

            this.ws.on('error', err => {
                reject(err);
            })
        });
    }

    // return promise, resolves once subscription is successful
    subscribe(id, pair, candleSize) {

        const sub = {
            id: id,
            pair: pair,
            candleSize: candleSize,
            status: 'pending'
        };

        //bookkeeping for establishing subscriptions
        this.subs.push(sub);

        this.ws.send(JSON.stringify({
            method: "SUBSCRIBE",
            params: [this.streams.kline(pair, candleSize)],
            id: id
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
        const subIndex = this.subs.findIndex(({id}) => id === reqId);
        const pendingSub = this.sub[subIndex];
        if(pendingSub.status === 'pending')
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

    _read() {}
}

module.exports = Realtime;