const config = require('./config');
const dotenv = require('dotenv');
const controller = require('./controller');
const server = require('./server');

// setup environment stuff
dotenv.config();

const boot = async config => {
    console.log("Booting...");
    try {
        let ctrl = new controller(config);
        let api = server(config);
        console.log("Boot complete");

        // REMOVE: bot instances for dev/testing
        // const { c1, c2, c3, c4, c5, c6 } = require('./testConfigs');
        // setTimeout(() => {ctrl.createLiveBot(c1)}, 0);
        // setTimeout(() => {ctrl.createPaperBot(c1)}, 0);
        // setTimeout(() => {ctrl.createPaperBot(c1)}, 0);
        // setTimeout(() => {ctrl.createPaperBot(c1)}, 0);

    } catch(error) {
        console.log("Boot failed: ", error.message);
        process.exit(1);
    }
};

boot(config);


