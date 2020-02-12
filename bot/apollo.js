const server = require('./server');
const BotManager = require('./BotManager');
const manager = new BotManager();

// Create a bot instance for dev/testing
// remove later

const api = server(manager);

setTimeout(() => {
    let firstBotConfig  = {
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
        advisor: {
            candleSize: "1m",
            strategy: {
                name: 'myStrategy',
                params: {
                    requiredHistory: 5
                }
            }
        },
        
    };
    
    manager.createBot(firstBotConfig);
}, 0);

setTimeout(() => {
    let secondBotConfig  = {
        launchUI: true,
        mode: "realtime",
        watch: {
            exchange: "binance",
            currency: "BTC",
            asset: "BNB",
            tickrate: 10,
            key: "gB8NBOByVIqXuAJxbPr266pPgpmJh4bAJz3UXg9ttBUNwde1Zt5K5kCgsd8u5193",
            secret: "YYEjznijxEqaGemsEudwIxmGVQZpI4q7XkrXD0lzL4g21djgltZmvdcyqJW4bi73"
        },
        advisor: {
            candleSize: "1m",
            strategy: {
                name: 'myStrategy',
                params: [
                    
                ]
            }
        },
    };
    
    manager.createBot(secondBotConfig);
}, 2000);

