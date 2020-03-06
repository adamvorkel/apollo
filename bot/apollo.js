const config = require('./config');
const controller = require('./controller');
const server = require('./server');


// Create a bot instance for dev/testing
// remove later
const {c1, c2, c3, c4, c5, c6} = require('./testConfigs');

const boot = config => {
    let app = new controller(config);
    let b1 = app.createBot(c1);
    let b2 = app.createBot(c2);
    let b3 = app.createBot(c3);
    // let b4 = app.createBot(c4);
    // let b5 = app.createBot(c5);
    // let b6 = app.createBacktest(c6);

    console.log("--- Boot complete ---");
    const api = server(app);

    setInterval(() => {
        api.pushState();
    }, 1000);

    app.on('event', event => {
        console.log(`${event.type} event occured, push to clients`);
        api.broadcast(event.type, event.payload);
    });
};

boot(config);


