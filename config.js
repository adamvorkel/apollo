let config = {
    launchUI: true,
    mode: "realtime",
    watch: {
        exchange: "binance",
        currency: "USDT",
        asset: "BTC",
        tickrate: 20
    },
    trader: {
        enabled: false,
        key: '',
        secret: ''
    }
};

module.exports = config;