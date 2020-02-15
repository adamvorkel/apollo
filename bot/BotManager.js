// manages intances of bots
const { fork } = require('child_process');
const path = require('path');
const { Writable } = require('stream');

const pipeline = require('./core/pipeline');


class Router {
    constructor() {
        this.routes = {};
    }

    register(id, pair) {
        if(!this.routes[pair])
            this.routes[pair] = [];
        
        this.routes[pair].push(id);
    }

    getSubs(pair) {
        return this.routes[pair] || [];
    }
};

class BotManager extends Writable {
    constructor() {
        super({objectMode: true});
        this.bots = new Map();
        this.router = new Router();
        this.createBot = this.createBot.bind(this);
        this.lastID = 0;
    }

    createBot(config) {
        const nextID = ++this.lastID;
        //add bot to list
        console.log(`Starting ${config.mode} bot: ${config.watch.asset + config.watch.currency}`);
        this.bots.set(nextID, new pipeline(nextID, config));
        this.router.register(nextID, config.watch.asset + config.watch.currency);
    }

    _write(data, encoding, callback) {
        switch(data.type) {
            case 'candle': {
                const candle = data.payload;
                const bots = this.router.getSubs(candle.pair);
                bots.forEach(bot => this.bots.get(bot).candle(candle));
                break;
            }
        }
        callback();
    }
}

module.exports = BotManager;