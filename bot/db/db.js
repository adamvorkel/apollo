const mongoose = require('mongoose');

class Store {
    constructor(config) {
        this.config = config;
        this.connected = false;
    }

    async connect() {
        try {
            await mongoose.connect(this.config.db.uri, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useCreateIndex: true
            });
            this.connected = true;
            console.log('Connected to db');
        } catch(error) {
            console.error(error);
            process.exit(1);
        }
    }

    processCandle(candle) {

    }
}

module.exports = Store;