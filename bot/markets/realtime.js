const Readable = require('stream').Readable;
const WebSocket = require('ws');

class Realtime {
    constructor() {
        this.ws = this.connect();
        this.lastMessageID = 0;
        this.pairs = {};
    }
    
    connect() { 
        return new Promise((resolve, reject) => {
            let ws = new WebSocket("wss://stream.binance.com:9443/stream?streams=");

            ws.on('open', () => {
                console.log('websocket connection complete');
                // establish the fresh ws connection
                resolve(ws);
            });

            ws.on('message', message => {
                this.handleMessage(message);
            });

            ws.on('close', (code, reason) => {
                console.error(`websocket closed with code: ${code}, reason: ${reason}`);
                this.reconnect();
            });

            ws.on('error', err => {
                reject(err);
            });
            
        });
    }

    async reconnect() {
        let pairs = (this.pairs) ? Object.keys(this.pairs) : [];
        let wait = (ms) => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve();
                }, ms)
            });
        };

        this.ws = null;
        const maxAttempts = 10;
        let attempt = 0;

        while(attempt < maxAttempts && !this.ws) {
            console.log(`Connection attempt ${attempt}`)
            try {
                this.ws = await this.connect();
                pairs.forEach(async pair => {
                    await this._subscribe(pair);
                });
            } catch(err) {
                console.error(`Failed to connect to websocket...`);
                await wait(1000);
            }
            ++attempt;
        }

        if(!this.ws) {
            console.error(`Unable to establish connection to websocket...`);
            process.exit(1);
        }
        
    }

    async getStream(pair) {
        /**
         * TODO : handle subscription confirm checking and promises more reliably
         * does a confirm response from the ws always pertain to the last request pair?
         */

        // first subscribe request, create stream and subscribe over ws
        if(!this.pairs[pair]) {
            this.pairs[pair] =  new Readable({objectMode: true, read: (chunk) => {}});
            this._subscribe(pair);
        }

        return this.pairs[pair];
    }

    async _subscribe(pair) {
        let ws = await this.ws;

        let kline = (symbol, interval) => `${symbol.toLowerCase()}@kline_${interval}`;
        const messageID = ++this.lastMessageID;

        ws.send(JSON.stringify({
            method: "SUBSCRIBE",
            params: [kline(pair, "1m")],
            id: messageID
        }));
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

// this.streams = {
//     depth: (symbol) => `${symbol.toLowerCase()}@depth`,
//     depthLevel: (symbol, level) => `${symbol.toLowerCase()}@depth${level}`,
//     kline: (symbol, interval) => `${symbol.toLowerCase()}@kline_${interval}`,
//     aggTrade: (symbol) => `${symbol.toLowerCase()}@aggTrade`,
//     trade: (symbol) => `${symbol.toLowerCase()}@trade`,
//     ticker: (symbol) => `${symbol.toLowerCase()}@ticker`,
//     allTickers: () => '!ticker@arr'
// };

module.exports = Realtime;