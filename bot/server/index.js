const express = require('express');
const WebSocketServer = require('ws').Server;
const http = require('http');
const routes = require('./routes');

let api = config => {
    /**
     * REST API config
     */
    let app = express();
    app.use(express.json());
    app.use(express.urlencoded({extended: true}));
    app.use('/api', routes);
    app.disable('x-powered-by');
    let server = http.createServer(app);

    /**
     * WSS server
     */
    let wss = new WebSocketServer({server});
    wss.on('connection', ws => {
        console.log(`New websocket client connected`)
        ws.isAlive = true;
        ws.on('pong', () => {
            ws.isAlive = true;
        });
        ws.ping();
        ws.on('error', e => {
            // handle socket error
        });
    });
    
    // heartbeat
    setInterval(() => {
        wss.clients.forEach(ws => {
            if(!ws.isAlive) {
                return ws.terminate();
            }
            ws.isAlive = false;
            ws.ping();
        })
    }, 10 * 1000);

    server.listen(config.api.port, () => {
        console.log(`API listening on port ${config.api.port}`);
    });

    const broadcast = (event, payload) => {
        let message = JSON.stringify({ event, payload });
        wss.clients.forEach(ws => ws.send(message));
    }

    return { broadcast };
}

module.exports = api;