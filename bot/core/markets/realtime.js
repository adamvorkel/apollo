const Readable = require('stream').Readable;
const WebSocket = require('ws');

class Realtime extends Readable {
    constructor(config) {
        super({objectMode: true});

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
        this.pending = {};
        this.lastMessageID = 0;
        this.pairs = [];
    }
    
    connect() {
        // establish the fresh ws connection
        return new Promise((resolve, reject) => {
            this.ws = new WebSocket("wss://stream.binance.com:9443/stream?streams=");

            this.ws.on('open', () => {
                resolve(this.ws);
            });

            this.ws.on('message', message => {
                this.handleMessage(message);
            });

            this.ws.on('error', err => {
                reject(err);
            })
        });
    }

    subscribe(pair) {
        // first subscribe request, add to combined websocket
        if(!this.pairs[pair]) {
            this.pairs[pair] = {
                status: 'pending'
            };

            const messageID = ++this.lastMessageID;

            this.pending[messageID] = pair;

            this.ws.send(JSON.stringify({
                method: "SUBSCRIBE",
                params: [this.streams.kline(pair, "1m")],
                id: messageID
            }));
        }
    }

    handleMessage(message) {
        const isCandle = (m) => {
            return m.data !== undefined && m.data.e == 'kline';
        };

        const isSubConfirm = (m) => m.result === null && m.id !== undefined && Number.isInteger(m.id);

        const payload = JSON.parse(message);

        // check if this is a candle -> process and push candle
        if(isCandle(payload)) {
            this.pushCandle(payload);
        } 
        // it's a confirmation of a subscription
        else if(isSubConfirm(payload)) {
            this.pairs[this.pending[payload.id]].status = 'active';
            delete this.pending[payload.id];
        }
    }

    pushCandle(rawCandle) {
        //create candle object in format that bots can consume
        const kline = rawCandle.data.k;
        const time = rawCandle.data.E;
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
        };

        this.push({type: candle.pair, payload: candle});
    }

    _read(candle) {}
}

module.exports = Realtime;