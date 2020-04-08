const api = require('./binance');
const candleAdapter = require('./candleAdapter')

const Support = {
    order: ['market', 'limit']
}

module.exports = {
    api, candleAdapter, Support
};
