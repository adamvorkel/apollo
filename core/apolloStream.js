const stream = require('stream').Writable;

class apolloStream extends stream {
    constructor(consumers) {
        let options = {
            objectMode: true
        }
        super(options);
        this.consumers = consumers;

        //when candle arrives
        for(const pluginSlug in this.consumers) {
            this.consumers[pluginSlug].processCandle();
        }
    }

    finalize() {
        this.emit("finalize");
    }
}

module.exports = apolloStream;