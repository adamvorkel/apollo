const pipeline = require('../core/pipeline');
const BacktestMarket = require('../core/markets/backtest');

process.send({type: 'status', payload: 'ready'});

const run = (config) => {
    // create market
    let market = new BacktestMarket();

    console.log('running backtest')
    new pipeline(config);
}


process.on('message', (message) => {
    if(message.task === 'start') {
        run(message.config);
    } else if(message.task === 'exit') {
        process.exit(0);
    }
});

setTimeout(() => {
    process.send({type: 'status', payload: 'done'});
}, 10000);

process.on('disconnect', () => {
    console.log(`Disconnect`);
    process.exit(-1);
});

process.on('unhandledRejection', message => {
    console.error('unhandledRejection', message);
    process.send({type: 'error', payload: message});
});

process.on('uncaughtException', e => {
    console.error('uncaughtException', e);
    process.send({type: 'error', payload: e});
    process.exit(1);
});
