// manages intances of bots
const { fork } = require('child_process');
const path = require('path');
const { Writable } = require('stream');

const pipeline = require('./core/pipeline');


class BotManager {
    constructor(market, channels) {
        this.market = market;
        this.channels = channels;
        this.bots = new Map();
        this.createBot = this.createBot.bind(this);
        this.lastID = 0;
    }

    createBot(config) {
        // create new bot
        let newBot = new pipeline(config);
        //add bot to list
        this.bots.set(++this.lastID, newBot);
        this.channels.subscribe(newBot.candle.bind(newBot), 'candle', config.watch.asset + config.watch.currency);
    }
}

module.exports = BotManager;