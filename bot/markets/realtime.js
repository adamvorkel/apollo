const Readable = require('stream').Readable;
const WebSocket = require('ws');

class Realtime {
    constructor() {

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
        this.lastMessageID = 0;
        this.pairs = {};
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
        /**
         * TODO : handle subscription confirm checking and promises more reliably
         * does a confirm response from the ws always pertain to the last request pair?
         */
        return new Promise((resolve, reject) => {
            // first subscribe request, add to combined websocket
            if(!this.pairs[pair]) {
                this.pairs[pair] =  new Readable({objectMode: true, read: (chunk) => {}});

                const messageID = ++this.lastMessageID;

                this.ws.send(JSON.stringify({
                    method: "SUBSCRIBE",
                    params: [this.streams.kline(pair, "1m")],
                    id: messageID
                }));
                
                const isSubConfirm = (m) => m.result === null && m.id !== undefined && Number.isInteger(m.id);
                const handleSubscribeConfirm = (payload) => {
                    const message = JSON.parse(payload);
                    if(isSubConfirm(message)) {
                        resolve(this.pairs[pair]);
                    }

                }

                this.ws.on('message', handleSubscribeConfirm);
            } else {
                resolve(this.pairs[pair]);
            }
        });
    }

    handleMessage(message) {
        const isCandle = (m) => {
            return m.data && m.data.e == 'kline';
        };

        const payload = JSON.parse(message);

        // check if this is a candle -> process and push candle
        if(isCandle(payload)) {
            this.pushCandle(payload);
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

        this.pairs[candle.pair].push(candle);
    }
}

module.exports = Realtime;