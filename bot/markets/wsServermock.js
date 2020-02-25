const WebSocketServer = require('ws').Server;

const wss = new WebSocketServer({ port: 8081 });
wss.on('connection', ws => {
    console.log('client ws connected...');
    setTimeout(() => {
        console.log('disconnecting client...');
        ws.close();
    }, 10000);
});

setInterval(() => {
    wss.clients.forEach(ws => {
        ws.send('data!');
    });
}, 200);
