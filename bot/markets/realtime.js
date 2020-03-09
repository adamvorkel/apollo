const WebSocket = require('ws');
const Readable = require('stream').Readable;

class Realtime {
    constructor() {
        this._ws = null;
        this._url = "wss://stream.binance.com:9443/stream?streams=";
        
        this._connectLock = false;
        this._retryCount = -1;
        this._maxReconnectDelay = 10000;
        this._connectionTimeout = 4000;
        this._connectTimeout = null;
        this._acceptOpenTimeout = null;
        this._messageQueue = [];
        this.lastMessageID = 0;
        
        this._handleOpen = this._handleOpen.bind(this);
        this._handleClose = this._handleClose.bind(this);
        this._handleMessage = this._handleMessage.bind(this);
        this._handleError = this._handleError.bind(this);

        this.pairs = new Map();

        this._connect();
    }

    getStream(pair) {
        pair = pair.toLowerCase();
        if(!this.pairs.has(pair)) {
            this.pairs.set(pair, new Readable({objectMode: true, read: (chunk) => {}}));
            this.subscribe(pair);
        }

        return this.pairs.get(pair);
    }

    subscribe(pair) {
        let kline = (symbol, interval) => `${symbol}@kline_${interval}`;
        const messageID = ++this.lastMessageID;
        const req = {
            method: "SUBSCRIBE",
            params: [kline(pair, "1m")],
            id: messageID
        };

        this._send(JSON.stringify(req));
    }

    pushCandle(rawCandle) {
        //create candle object in format that bots can consume
        const kline = rawCandle.data.k;
        const time = rawCandle.data.E;
        const pair = kline.s.toLowerCase()
        const candle = {
            pair: pair,
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

        this.pairs.get(pair).push(candle);
    }

    _send(message) {
        if(this._ws && this._ws.readyState === WebSocket.OPEN) {
            this._ws.send(message);
        } else {
            this._messageQueue.push(message);
        }
    }

    _connect() {
        if(this._connectLock) return;
        this._connectLock = true;

        this._retryCount++;

        this._wait().then(() => {
            this._ws = new WebSocket(this._url);
            this._connectLock = false;
            this._ws.on('open', this._handleOpen);
            this._ws.on('close', this._handleClose);
            this._ws.on('message', this._handleMessage);
            this._ws.on('error', this._handleError);

            this._connectTimeout = setTimeout(() => {
                this._handleError(new Error('websocket timeout'))
            }, this._connectionTimeout);
        });
    }

    _disconnect(code = 1000) {
        clearTimeout(this._connectTimeout);
        clearTimeout(this._acceptOpenTimeout);
        this.lastMessageID = 0;
        if(!this._ws) return;
        this._ws.off('open', this._handleOpen);
        this._ws.off('close', this._handleClose);
        this._ws.off('message', this._handleMessage);
        this._ws.off('error', this._handleError);
        if(this._ws.readyState === WebSocket.OPEN || this._ws.readyState === WebSocket.CONNECTING) {
            try {
                this._ws.close(code);
            } catch(err) {
            }
        }
        this._ws = null;
    }

    _reconnect() {
        console.log('reconnecting...');
        this._retryCount = -1;
        this._disconnect();
        this._connect();
        // resubscribe to pairs
        this.pairs.forEach((stream, pair) => {
            this.subscribe(pair);
        });
    }

    _wait() {
        let delay = (this._retryCount > 0) ? Math.min(1000 * Math.pow(1.3, this._retryCount), this._maxReconnectDelay) : 0;

        return new Promise((resolve, reject) => {
            setTimeout(resolve, delay);
        });
    }

    _handleOpen(event) {
        clearTimeout(this._connectTimeout);
        
        // send queued messages
        while(this._messageQueue.length > 0 && this._ws.readyState === WebSocket.OPEN) {
            this._send(this._messageQueue.shift());
        }

        this._acceptOpenTimeout = setTimeout(() => {
            this._retryCount = -1;
        }, 5000);
    }

    _handleClose(event) {
        console.debug('close event');
        this._disconnect();
        this._connect();
    }

    _handleMessage(message) {
        const isCandle = (m) => {
            return m.data && m.data.e == 'kline';
        };
        const payload = JSON.parse(message);
        if(isCandle(payload)) {
            this.pushCandle(payload);
        }
    }

    _handleError(event) {
        console.debug('error event', event);
        this._disconnect();
        this._connect();
    }
}

module.exports = Realtime;
