const express = require('express');

const path = require('path');
const BotManager = require('./BotManager');
const WebSocketServer = require('ws').Server;

const manager = new BotManager();

// Create a bot instance for dev/testing
// remove later

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
}, 6000);


/*-----------------*/
// REST API server
/*-----------------*/
const app = express();
const port = 3001;

// app middleware config
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Endpoints

app.get('/api/bots', (req, res) => {
    res.json(manager.listBots())
});

app.post('/api/stopBot', (req, res) => {
    const id = req.body.id;
    if(!id) {
        res.json({status:"failure"});
    } else {
        //we have an id, stop bot instance
        const stopped = manager.stopBot(id);
        if(stopped) {
            res.json({id: id, status:"success"});
        } else {
            res.json({status:"failure"});
        }
    }
});

let server = app.listen(port, () => {
    console.log(`Apollo API listening on port ${port}`);
});

/*-----------------*/
// WSS server
/*-----------------*/

const wss = new WebSocketServer({server: server});

wss.on('connection', ws => {
    console.log(`New websocket connected`)
    ws.isAlive = true;
    ws.on('pong', () => {
        ws.isAlive = true;
    });
    ws.ping();
    ws.on('error', e => {
        // handle socket error
    })
});

setInterval(() => {
    wss.clients.forEach(ws => {
        if(!ws.isAlive) {
            return ws.terminate();
        }
        ws.isAlive = false;
        ws.ping();
    })
}, 10 * 1000);

const broadcast = (event, data) => {
    const payload = JSON.stringify({
        event: event, 
        payload: data
    });
    wss.clients.forEach(ws => {
        ws.send(payload, err => {
            if(err) {
                console.log("Broadcast error")
            }
        })
    })
}

manager.on('botStarted', (payload) => {
    broadcast('botStarted', payload);
});


return app;
