const config = require('./config');
const controller = require('./controller');
const server = require('./server');


// Create a bot instance for dev/testing
// remove later
const {c1, c2, c3, c4, c5, c6} = require('./testConfigs');

const boot = async config => {
    console.log("Booting...");
    try {
        let ctrl = new controller(config);
        let api = server(config, ctrl);
        console.log("Boot complete");


        setTimeout(() => {ctrl.createLiveBot(c1)}, 0);
        setTimeout(() => {ctrl.createPaperBot(c1)}, 0);
        // setTimeout(() => {ctrl.createPaperBot(c1)}, 0);
        // setTimeout(() => {ctrl.createPaperBot(c1)}, 0);

        // ctrl.createPaperBot(c2);
    } catch(error) {
        console.log(error)
        console.log("Boot failed: ", error.message);
        process.exit(1);
    }

    
    /**
     * This is temporarily here for testing
     */
    
    // let b5 = controller.createBot(c5);
    // let b6 = controller.createBacktest(c6);

    // app.on('event', event => {
    //     api.broadcast(event.type, event.payload);
    // });
};

boot(config);


