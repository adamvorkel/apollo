const WebSocket = require('ws');
const Readable = require('stream').Readable;
const ReconnectWS = require('../../reconnectWS');

class BinanceWS extends Readable {
    constructor(endpoint) {
        super({ objectMode: true });


        this.subscriptions = new Map();
        this._pendingConfirms = [];
        this.lastMessageID = 0;

        this.ws = new ReconnectWS(`wss://stream.binance.com:9443/stream?streams=${endpoint}`, {refresh: 30*60*1000});

        this.ws.on('reconnect', async () => {
            // resubscribe to streams
            this._pendingConfirms = [];
            await Promise.all(Array.from(this.subscriptions.keys()).map(async (endpoint) => {
                console.log(`Resubbing to ${endpoint}`);
                return await this.subscribe(endpoint);
            }));
        });

        this.ws.on('message', message => {
            const payload = JSON.parse(message);

            // handle any confirms
            this._pendingConfirms = this._pendingConfirms.filter(cb => !cb(payload));
            this.push(payload);
        });

        this.ws.on('error', error => {
            console.log("ERROR: ", error.message);
        });

        this.ws.on('close', () => {
            this.lastMessageID = 0;
        });
    }

    _read() {}

    

    async subscribe(endpoint) {  
        // return await this.ws.subscribe(req, done);
        return new Promise((resolve, reject) => {

            const req = {
                method: "SUBSCRIBE",
                params: [endpoint],
                id: ++this.lastMessageID
            };
            this.ws.send(JSON.stringify(req));

            this._pendingConfirms.push(res => {
                let confirmed = res.id && res.id === req.id || false;
                if(confirmed) resolve();
                return confirmed;
            });

        });
    }  
}

module.exports = BinanceWS;
