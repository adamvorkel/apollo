const { Writable } = require('stream');

class Channel extends Writable {
    constructor() {
        super({objectMode: true});
        this.consumers = {};
    }

    subscribe(consumer, event) {
        if(!this.consumers[event]) {
            this.consumers[event] = [];
        }
        this.consumers[event].push(consumer);
    }

    _write(event, encoding, callback) {
        if(this.consumers[event.type]) {
            this.consumers[event.type].forEach(consumer => {
                consumer(event.payload);
            });
        }
        callback();
    }
}

class Channels {
    constructor() {
        this.channels = new Map();
    }

    create(source, channel) {
        if(!this.channels.has(channel)) {
            this.channels.set(channel, new Channel());
        }
        source.pipe(this.channels.get(channel));
    }

    subscribe(listener, channelKey, event) {
        const channel = this.channels.get(channelKey);
        if(channel) {
            channel.subscribe(listener, event);
            return true;
        }
        return false;
    }
}

module.exports = {Channel, Channels};