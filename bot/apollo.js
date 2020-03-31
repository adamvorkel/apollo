const config = require('./config');
const dotenv = require('dotenv');
const controller = require('./controller');
const clientFacade = require('./server');

// setup environment stuff
dotenv.config();

// boot
console.log("Booting...");
let ctrl = new controller(config);
let api = new clientFacade(config);
console.log("Boot complete");

// REMOVE: bot instances for dev/testing
// const { c1, c2, c3, c4, c5, c6 } = require('./testConfigs');
// setTimeout(() => {ctrl.createLiveBot(c1)}, 0);
// setTimeout(() => {ctrl.createPaperBot(c1)}, 0);
// setTimeout(() => {ctrl.createPaperBot(c1)}, 0);
// setTimeout(() => {ctrl.createPaperBot(c1)}, 0);






