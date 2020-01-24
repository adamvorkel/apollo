const path = require('path');
const util = require('./core/util');
const config = util.getConfig();
const pipeline = require('./core/pipeline');

let instance = new pipeline(config);

if(config.launchUI) {
    //require(path.join(util.dirs().web, 'server'))
}