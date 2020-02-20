const config = require('./config');
const controller = require('./controller');
const server = require('./server');


// Create a bot instance for dev/testing
// remove later
const {c1, c2, c3, c4, c5, c6} = require('./testConfigs');

const boot = async (config) => {
    let app = new controller(config);

    await app.connectToMarket();
    
    // let b1 = controller.createBot(c1);
    
    let b3 = app.createBot(c3);
    let b4 = app.createBot(c4);
    setTimeout(() => {
        console.log('creating bot 2')
        let b2 = app.createBot(c2);
    },5000);
    let b5 = app.createBot(c5);
    // let b6 = app.createBacktest(c6);

    return app;
};

boot(config).then((app) => {
    console.log("--- Boot complete ---");
    const api = server(app);

    app.on('event', event => {
        console.log(`${event.type} event occured, push to clients`);
        api.broadcast(event.type, event.payload);
    });
});


