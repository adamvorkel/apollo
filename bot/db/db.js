const mongoose = require('mongoose');

class Store {
    constructor(config) {
        this.config = config;
        this.connected = false;
        this.connect();
    }

    connect() {
        mongoose.connect(this.config.uri)
        .then(() => {
            this.connected = true;
            console.log('Connected to db');
        })
        .catch(error => {
            console.error(error);
            process.exit(1);
        })
    }

    processCandle(candle) {

    }
}

module.exports = Store;