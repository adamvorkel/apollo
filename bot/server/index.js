const http = require('http');
const express = require('express');
const WebSocketServer = require('ws').Server;
const jwt = require('jsonwebtoken');
const routes = require('./routes');

let setupExpress = () => {
    let app = express();
    app.use(express.json());
    app.use(express.urlencoded({extended: true}));
    app.disable('x-powered-by');
    // AUTH
    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
    const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

    let generateAccessToken = user => jwt.sign(user, accessTokenSecret, { expiresIn: '30s' });
    let generateRefreshToken = user => jwt.sign(user, refreshTokenSecret);

    let authenticateToken = (req, res, next) => {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if(!token) return res.sendStatus(401);
        jwt.verify(token, accessTokenSecret, (err, user) => {
            if(err) return res.sendStatus(403);
            req.user = user;
            next();
        })
    };

    // change this for production
    // server restarts -> tokens lost from memory
    // use db
    let refreshTokens = [];
    app.post('/login', (req, res) => {
        // TODO: Authenticate user

        const user = { name: req.body.username };
        
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        refreshTokens.push(refreshToken);
        res.json({ accessToken, refreshToken });
    });

    app.delete('/logout', (req, res) => {
        refreshTokens = refreshTokens.filter(token => token !== req.body.token);
        res.sendStatus(204);
    });

    app.post('/token', (req, res) => {
        const refreshToken = req.body.token;
        if(!refreshToken) return res.sendStatus(401);
        if(!refreshTokens.includes(refreshToken)) return res.sendStatus(403);
        jwt.verify(refreshToken, refreshTokenSecret, (err, user) => {
            if(err) return res.sendStatus(403);
            const accessToken = generateAccessToken({ name: user.name });
            return res.json({ accessToken });
        });
    });

    return app;
}

let setupWSS = (server) => {
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

    return wss;
}  



class API {
    constructor(config) {
        this.config = config;
        this.app = setupExpress();
        this.server = new http.createServer(this.app);
        this.wss = setupWSS(this.server);
        this.port = null;
        this.start();
    }

    broadcast(event, payload) {
        // this.api.broadcast(event, payload);
        let message = JSON.stringify({ event, payload });
        this.wss.clients.forEach(ws => ws.send(message));
    }

    start() {
        this.port = process.env.PORT || this.config.api.port || 5000;
        this.server.listen(port, () => {
            console.log(`API listening on port ${port}`);
        });
    }
}

module.exports = API;