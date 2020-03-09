const Readable = require('stream').Readable;

class Backtest extends Readable {
    constructor() {
        super({objectMode: true});
        console.log('Backtest market created');
        this.pair;
        this.stream = new Readable({objectMode: true, read: (chunk) => {}});
    }

    getStream(pair) {
        // get data for pair from db
        // if not in db get from api and save to db
        return this.stream;
    }
}

module.exports = Backtest;