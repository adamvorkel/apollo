// managers intances of bots
const { fork } = require('child_process');
const path = require('path');
const { EventEmitter } = require('events');
const Market = require('./core/markets/realtime');

let lastBotID = 0;

class BotManager extends EventEmitter {
    constructor() {
        super();

        this.bots = [];
        this.market;

        this.setupMarket = this.setupMarket.bind(this);
        this.dispatch = this.dispatch.bind(this);
        this.createBot = this.createBot.bind(this);
        this.startBot = this.startBot.bind(this);  
        this.stopBot = this.stopBot.bind(this);
        this.countBots = this.countBots.bind(this);
        this.listBots = this.listBots.bind(this);
        
        this.setupMarket();
    }

    setupMarket() {
        this.market = new Market();
        // dispatch candle
        this.market.on('data', this.dispatch);
        // subscription complete
        this.market.on('subComplete', this.startBot);
    }

    dispatch(candle) {
        //only send closed candles to bots
        if(candle.isClosed) {
            const bot = this.bots.find(bot => bot.pair === candle.pair);
            bot.instance.send({task: 'candle', candle: candle})
        }
    }

    createBot(config) {
        // fork a child process to run bot
        let child = fork(path.join(__dirname, "/workers/bot"));

        console.log(child.pid);

        //add bot to list
        const id = ++lastBotID
        const newBot = {
            id: id,
            pair: config.watch.asset + config.watch.currency,
            mode: config.mode,
            config: config,
            start: null, 
            instance: child
        };
        this.bots.push(newBot);

        child.on('message', message => {
            this.handleBotMessage(newBot, message);
        });

        child.on('exit', () => {
            //close subscription
            console.log("child exited");
        });
    }

    startBot(pair) {
        const waitingBot = this.bots.find(bot => bot.pair === pair);

        waitingBot.start = Date.now();

        waitingBot.instance.send({
            task: 'start',
            config: waitingBot.config
        });
    }

    countBots() {
        return this.bots.length;
    }

    stopBot(id) {
        //close subscription
        // if(!this.bots[id]) {
        //     return false;
        // } else {
        //     // TODO: stop bot
        //     return true;
        // }
    }

    listBots() {
        // let list = [];
        // for(const uid in this.bots) {
        //     list.push({
        //         id: this.bots[uid].uid,
        //         mode: this.bots[uid].mode,
        //         start: this.bots[uid].start
        //     });
        // };

        // return {
        //     bots: list
        // }
    }

    handleBotMessage(bot, message) {
        switch(message) {
            case 'ready': {
                // initiate a ws subscription for bots trading pair
                this.market.subscribe(bot.pair);
                break;
            }
            case 'done': {
                // TODO:
                // close ws for this bots pair then send exit
                bot.instance.send({task: 'exit'});
                break;
            }
            default: {
                console.error('Unknown child process message');
                process.exit(1);
            }
        }
    }
}

module.exports = BotManager;