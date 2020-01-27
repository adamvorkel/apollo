const path = require('path');
const util = require('./core/util');
const config = util.getConfig();
const pipeline = require('./core/pipeline');

if(config.launchUI) {
    let ui = require('./web/server');
}

let instance = new pipeline(config);



