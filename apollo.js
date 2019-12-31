const path = require('path');
const util = require(__dirname + '/core/util');
const config = util.getConfig();
const pipeline = require(path.join(util.dirs().core, 'pipeline'));



let pp = new pipeline(config);

if(config.launchUI) {
    //require(path.join(util.dirs().web, 'server'))
}