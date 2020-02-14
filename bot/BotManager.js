// manages intances of bots
const { fork } = require('child_process');
const path = require('path');
const { EventEmitter } = require('events');

const pipeline = require('./core/pipeline');

class BotManager extends EventEmitter {
    constructor() {
        super();

        this.bots = {};
        this.market;

        this.setupMarket = this.setupMarket.bind(this);
        this.dispatchCandle = this.dispatchCandle.bind(this);
        this.createBot = this.createBot.bind(this);
        
        this.setupMarket();
    }

    setupMarket() {
        this.market = new Market();
        // dispatch candle
        
    }

    dispatchCandle(candle) {
        //send closed candles to appropriate bot
        if(candle.isClosed) {
            const bot = this.bots.find(bot => bot.pair === candle.pair);
            bot.instance.send({task: 'candle', candle: candle});
        }
    }

    createBot(config) {
        //add bot to list
        const newBot = new pipeline(config);
        const pair = config.watch.asset + config.watch.currency
        this.bots[pair] = newBot;  
    }


    

  
}

module.exports = BotManager;