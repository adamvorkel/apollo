const EventEmitter = require('events');
const Readable = require('stream').Readable;
const path = require('path');
const ws = require('ws');

const util = require('../util');
const config = util.getConfig();

class Heart extends EventEmitter {
    constructor(config) {
        super();
        this.tickrate = config.watch.tickrate * 1000;
        this.lastTick = false;
    }

    pump() {
        console.log("scheduling ticks...");
        setTimeout(() => {
            this.tick();
            setInterval(() => {
                this.tick();
            }, this.tickrate);
        }, 0);
    }

    tick() {
       if(this.lastTick) {
           if(this.lastTick < Date.now() - (this.tickrate * 3)) {
               console.log("Failed to tick in time");
           }
       } 

       this.lastTick = Date.now();
       
       this.emit("tick");
    }
}

class BinanceWS {
    constructor() {

    }

    setupWebSocket(address) {
        const ws = new WebSocket(address);
        ws.on('message', (message) => {

        })
    }

}

class Binance {
    constructor(config) {

    }
}

class Fetcher extends EventEmitter {
    constructor(config) {
        super();
        this.marketStarted = false;
        this.exchange = config.watch.exchange;
        // load exchange
        this.trader = new Binance(config);
        this.pair = `${config.watch.currency}/${config.watch.asset}`;
        console.log(`Watching market ${this.exchange} ${this.pair}`);
    }

    relayTrades(batch) {
        if(!this.marketStarted)
            this.emit('marketStarted', batch);
        this.emit('marketUpdate', batch);
        this.emit('trades', batch);
    }

    fetch() {
        console.log("Fetch")
    }
}

class Realtime extends Readable {
    constructor(config) {
        super({objectMode: true});
        this.heart = new Heart(config);
        this.fetcher = new Fetcher(config);
        this.heartbeat();
    }

    heartbeat() {
        this.heart.on('tick', this.fetcher.fetch);
        this.heart.pump();
    }

    
}

module.exports = Realtime;