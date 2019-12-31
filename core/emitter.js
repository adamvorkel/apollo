const EventEmitter = require('events');

class ApolloEventEmitter extends EventEmitter {
    constructor() {
        super();
        this.defferedEvents = [];
    }

    defferedEmit(name, payload) {
        this.defferedEvents.push({name, payload})
    }

    broadcastDefferedEmit() {
        if(this.defferedEvents.length > 0) {
            let event = this.defferedEvents.shift();
            this.emit(event.name, event.payload);
            return true;
        }
        return false;
    }
}

module.exports = ApolloEventEmitter;