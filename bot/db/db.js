const mongoose = require('mongoose');

class db {
    constructor(config) {
        this.config = config;
        this.uri = config.db.uri;
        this.connected = false;
    }

    async connect() {
        try {
            await mongoose.connect(this.uri, {
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

module.exports = db;