const Readable = require('stream').Readable;

class Backtest extends Readable {
    constructor() {
        super({objectMode: true});
        console.log('Backtest market created')
    }
}

module.exports = Backtest;