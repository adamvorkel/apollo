const stream = require('stream').Writable;

class apolloStream extends stream {
    constructor(plugins) {
        let options = {
            objectMode: true
        }
        super(options);
        this.plugins = plugins;
        console.log("Starting stream");
    }
}

module.exports = apolloStream;