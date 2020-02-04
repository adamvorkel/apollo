const stream = require('stream').Writable;

class apolloStream extends stream {
    constructor(consumers) {
        let options = {
            objectMode: true
        }
        super(options);
        this.consumers = consumers;
    }

    finalize() {
        this.emit("finalize");
    }

    _write(candle, endcoding, done) {
        for(const pluginSlug in this.consumers) {
            this.consumers[pluginSlug].processCandle(candle);
        }
        done();
    }
}

module.exports = apolloStream;