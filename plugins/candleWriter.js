const path = require('path');
const util = require('../core/util');
const emitter = require(path.join(util.dirs().core, "emitter"));

class CandleWriter extends emitter {

}

module.exports = CandleWriter;