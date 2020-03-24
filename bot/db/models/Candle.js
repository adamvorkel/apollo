const mongoose = require('mongoose');

const CandleSchema = new mongoose.Schema({
    pair: {
        type: String,
        required: true
    },
    interval: {
        type: Number,
        required: true
    },
    start: {
        type: Date,
        required: true
    },
    open: {
        type: Number,
        required: true
    },
    close: {
        type: Number,
        required: true 
    },
    high: {
        type: Number,
        required: true
    },
    low: {
        type: Number,
        required: true
    },
    trades: {
        type: Number,
        required: true,
    },
    volume: {
        type: Number,
        required: true
    }
});

const Candle = mongoose.model('candle', CandleSchema);

module.exports = Candle;