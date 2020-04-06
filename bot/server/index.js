const http = require('http');
const express = require('express');
const WebSocketServer = require('ws').Server;

let setupExpress = () => {
    let app = express();
    app.use(express.json());
    app.use(express.urlencoded({extended: true}));
    app.disable('x-powered-by');

    app.use('/auth', require('./routes/auth'));
    app.use('/api', require('./routes/api'));

    return app;
}

let setupWSS = (server) => {
    let wss = new WebSocketServer({server});
    wss.on('connection', ws => {
        console.log(`New websocket client connected`);
        ws.isAlive = true;
        ws.on('pong', () => ws.isAlive = true);
        ws.ping();
        ws.on('error', e => {/* handle socket error */ });
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

    return wss;
}  

class API {
    constructor(config) {
        this.config = config;
        this.app = setupExpress();
        this.server = new http.createServer(this.app);
        this.wss = setupWSS(this.server);
        this.port = process.env.PORT || this.config.api.port || 5000;
        this.start();
    }

    broadcast(event, payload) {
        // this.api.broadcast(event, payload);
        let message = JSON.stringify({ event, payload });
        this.wss.clients.forEach(ws => ws.send(message));
    }

    start() {
        this.server.listen(this.port, () => {
            console.log(`Server running on port ${this.port}`);
        });
    }
}

module.exports = API;