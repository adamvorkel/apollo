const express = require('express');
const WebSocketServer = require('ws').Server;

let api = (botManager) => {

    // return new Promise((res, rej) => {

    // })

    /*-----------------*/
    // REST API server
    /*-----------------*/
    const app = express();
    const port = 3001;

    // App middleware config
    app.use(express.json());
    app.use(express.urlencoded({extended: true}));

    // Endpoints
    app.get('/api/bots', (req, res) => {});

    app.post('/api/stopBot', (req, res) => {});

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

    return {
        broadcast
    }
}

module.exports = api;