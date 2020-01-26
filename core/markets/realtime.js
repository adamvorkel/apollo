const Readable = require('stream').Readable;
const Heart = require('./heart');
const Fetcher = require('./fetcher');

class Realtime extends Readable {
    constructor(config) {
        super({objectMode: true});
        this.heart = new Heart(config);
        this.fetcher = new Fetcher(config);
        this.run();
    }

    run() {
        this.fetcher.on('marketStart', () => {
            this.emit('marketStart');
        });
        this.fetcher.on('marketUpdate', () => {
            this.emit('marketUpdate');
        });
        this.fetcher.on('trades', trades => {
            this.emit('trades', trades);
        });
        this.heart.on('tick', () => {
            this.fetcher.fetch();
        });

        this.heart.pump();
    }

    
}

module.exports = Realtime;