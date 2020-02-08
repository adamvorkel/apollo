const pipeline = require('../core/pipeline');

let start = (config) => {
    let instance = new pipeline(config);
    
    process.on('message', message => {
        if(message.task === 'candle') {
            console.log("BOT RECIEVED CANDLE")
            instance.candle(message.candle)
        }
    })
}

process.send('ready');

process.on('message', (message) => {
    if(message.task === 'start') {
        start(message.config);
    } else if(message.task === 'exit') {
        process.exit(0);
    }
});

process.on('disconnect', () => {
    console.log(`Disconnect`);
    process.exit(-1);
});

process.on('unhandledRejection', message => {
    console.error('unhandledRejection', message);
    process.send({type: 'error', message: message});
});

process.on('uncaughtException', e => {
    console.error('uncaughtException', e);
    process.send({type: 'error', error: e});
    process.exit(1);
});
