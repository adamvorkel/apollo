let config = {
    launchUI: true,
    mode: "realtime",
    watch: {
        exchange: "binance",
        currency: "USDT",
        asset: "BTC",
        tickrate: 10,
        key: "gB8NBOByVIqXuAJxbPr266pPgpmJh4bAJz3UXg9ttBUNwde1Zt5K5kCgsd8u5193",
        secret: "YYEjznijxEqaGemsEudwIxmGVQZpI4q7XkrXD0lzL4g21djgltZmvdcyqJW4bi73"
    },
    strategy: {
        name: 'myStrategy',
        params: [
            
        ]
    }
};

module.exports = config;