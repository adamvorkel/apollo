const WebSocket = require('ws');
const Readable = require('stream').Readable;
const ReconnectWS = require('../markets/reconnectWS');

class BinanceWS {
    constructor() {
        this.subscriptions = new Map();
        this.ws = new ReconnectWS("wss://stream.binance.com:9443/stream?streams=");
        this.lastMessageID = 0;

        this.ws.on('open', () => {
            // set refresh timer for connection
            setInterval(() => {
                this.ws._reconnect();
            }, 2*60*1000);
        });

        this.ws.on('reconnect', async () => {
            // resubscribe to streams
            console.log('Reconnecting ....')
            await Promise.all(Array.from(this.subscriptions.keys()).map(async (endpoint) => {
                console.log(`Resubbing to ${endpoint}`);
                return await this.subscribe(endpoint);
            }));
        });

        this.ws.on('message', message => {
            const isCandle = (m) => m.data && m.data.e == 'kline';
            const payload = JSON.parse(message);
            if(isCandle(payload)) {
                this.pushCandle(payload)
            }
        });

        this.ws.on('error', error => {
            console.log("ERROR: ", error.message);
        });

        this.ws.on('close', () => {
            this.lastMessageID = 0;
        });
    }

    async getStream(endpoint) {
        if(!this.subscriptions.has(endpoint)) {
            this.subscriptions.set(endpoint, new Readable({objectMode: true, read: (chunk) => {}}));
            await this.subscribe(endpoint);
            console.log("SUB TO ENDPOINT ", endpoint, " COMPLETE")
        }

        return this.subscriptions.get(endpoint);
    }

    async getKlineStream(pair) {
        pair = pair.replace('/', '').toLowerCase();
        let endpoint = `${pair}@kline_1m`;
        return await this.getStream(endpoint);
    }

    async subscribe(endpoint) {
        const req = {
            method: "SUBSCRIBE",
            params: [endpoint],
            id: ++this.lastMessageID
        };

        let done = res => (res.id && res.id == req.id);
        
        return await this.ws.subscribe(req, done);
    }

    pushCandle(payload) {
        //create candle object in format that bots can consume
        const kline = payload.data.k;
        const stream = payload.stream;
        const time = payload.data.E;
        const candle = {
            pair: kline.s.toLowerCase(),
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

        this.subscriptions.get(stream).push(candle);
    }   
}

module.exports = BinanceWS;
