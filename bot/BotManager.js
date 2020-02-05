// managers intances of bots
const { fork } = require('child_process');
const path = require('path');
const { EventEmitter } = require('events');
const Market = require('./core/markets/realtime');

class BotManager extends EventEmitter {
    constructor() {
        super();
        this.bots = {};
        this.market = new Market();
        this.market.on('data', payload => {
            if(payload.stream) {

                let kline = payload.data.k;
                let time = payload.data.E;
                let candle = {
                    isClosed: kline.x,
                    time: time,
                    start: kline.t,
                    open: kline.o,
                    close: kline.c,
                    high: kline.h,
                    low: kline.l,
                    trades: kline.n,
                    volume: kline.v
                }

                for(const botID in this.bots) {
                    const bot = this.bots[botID];
                    bot.instance.send({task: 'candle', candle: candle})
                }
            } else {
                console.log(payload);
            }
        });
    }

    subscribeToStream(pair) {
        return this.market.subscribe([pair]);
    }

    count() {
        let count = 0;
        for(const botID in this.bots) {
            ++count;
        }
        return count;
    }

    generateUID() {
        let uid;
        do {
            uid = (Math.round(Math.random() * 9) + 1);
        } while (uid in this.bots);
        return uid;
    }

    add(config) {
        // create unique ID
        const uid = this.generateUID();
        const pair = config.watch.asset + config.watch.currency;

        // fork a child bot
        let child = fork(path.join(__dirname, "/workers/bot"));
        child.on('message', (message) => {
            // wait for bot to spin up
            if(message === 'ready') {
                // initiate a ws subscription for bots trading pair
                this.subscribeToStream(pair)
                    .then(() => {
                        // once subscriptions confirmed, start the bot
                        return child.send({
                            task: 'start',
                            config: config
                        });
                    });
            // TODO:
            // close ws for this bots pair then send exit
            } else if(message === 'done') {
                return child.send({
                    task: 'exit'
                });
            }
        });

        child.on('exit', () => {
            console.log("child exited");
        });

        //add bot to list
        this.bots[uid] = {
            uid: uid,
            pair: config.watch.asset + config.watch.currency,
            mode: config.mode,
            start: Date.now(),
            instance: child
        };

        // console.log(`Bot ${uid} running (${this.count()} running)`);
        
        this.emit('botStarted', {
            id: uid,
            config: config
        });
    }

    handleChildMessage(message) {

    }

    stop(id) {
        if(!this.bots[id]) {
            return false;
        } else {
            // TODO: stop bot
            return true;
        }
    }

    list() {
        let list = [];
        for(const uid in this.bots) {
            list.push({
                id: this.bots[uid].uid,
                mode: this.bots[uid].mode,
                start: this.bots[uid].start
            });
        };

        return {
            bots: list
        }
    }
}

module.exports = BotManager;