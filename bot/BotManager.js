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
        this.stream = null;
        
    }

    setupMarket() {
        const pairs = [];
        for(const botID in this.bots) {
            const bot = this.bots[botID];
            const pair = bot.pair;
            pairs.push(pair);
        }

        if(this.stream) {
            // console.log("Stream already OPEN")
        }

        this.stream = this.market.subscribe(pairs);
        this.market.on('data', data => {
            console.log(data.stream);
        });
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

        //create unique ID
        const uid = this.generateUID();

        //fork a child bot
        let child = fork(path.join(__dirname, "/workers/bot"));
        child.on('message', (message) => {
            if(message === 'ready') {
                this.setupMarket();
                return child.send({
                    task: 'start',
                    config: config
                });
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

        console.log(`Bot ${uid} running (${this.count()} running)`);
        
        this.emit('botStarted', {
            id: uid,
            config: config
        });
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