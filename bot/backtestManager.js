/**
 * 
 * Manages backtest child processes
 * 
 */

const {EventEmitter} = require('events');
const { fork } = require('child_process');

class BacktestManager extends EventEmitter {
    constructor(config) {
        super();
        this.backtests = new Map();
    }

    create(config) {
        const daterange = `${config.daterange.to}-${config.daterange.from}`;
        const pair = `${config.watch.asset}${config.watch.currency}`
        const backtestProcess = fork(__dirname + '/workers/backtest.js');
        backtestProcess.on('message', message => {
            switch(message.type) {
                case 'status': {
                    if(message.payload === 'ready') {
                        console.log('Got a message from the child backtest process ' + message.payload)
                        this.emit('backtestStart', {timestamp: 123});
                        backtestProcess.send({task: 'start', config: config});
                    } else if(message.payload === 'done') {
                        this.emit('backtestComplete', {results: 'poop'});
                        backtestProcess.send({task: 'exit'});
                    }
                }
                case 'error': {
                    this.emit('backtestError', message.payload);
                }
            }
        });
    }
};

module.exports = BacktestManager;