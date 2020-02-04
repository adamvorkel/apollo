// managers intances of bots
const { fork } = require('child_process');
const path = require('path');
const { EventEmitter } = require('events');

class BotManager extends EventEmitter {
    constructor() {
        super();
        this.bots = {};
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
        // console.log(config)
        //create unique ID
        const uid = this.generateUID();
        //fork a child bot
        let child = fork(path.join(__dirname, "/workers/bot"));
        child.on('message', (message) => {
            if(message === 'ready') {
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