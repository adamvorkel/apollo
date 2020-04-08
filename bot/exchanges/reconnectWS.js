const WebSocket = require('ws');
const { EventEmitter } = require('events');

class ReconnectWS extends EventEmitter {
    constructor(url, options) {
        super();
        this._ws = null;
        this._url = url;
        this._connectLock = false;
        this._retryCount = -1;
        this._maxReconnectDelay = 10000;
        this._connectionTimeout = 4000;
        this._connectTimeout = null;
        this._acceptOpenTimeout = null;
        this._refreshInterval = null;
        this._messageQueue = [];

        this._handleOpen = this._handleOpen.bind(this);
        this._handleClose = this._handleClose.bind(this);
        this._handleMessage = this._handleMessage.bind(this);
        this._handleError = this._handleError.bind(this);

        if(options.refresh)
            this._refreshInterval = setInterval(() => this._reconnect(), options.refresh)

        this._connect();
    }

    _connect() {
        if(this._connectLock) return;
        this._connectLock = true;

        this._retryCount++;
        let delay = (this._retryCount > 0) ? Math.round(Math.min(1000 * Math.pow(1.3, this._retryCount), this._maxReconnectDelay)) : 0;
        // console.log(`websocket connecting (attempt ${this._retryCount}, delay ${delay})...`);

        this._wait(delay).then(() => {
            this._ws = new WebSocket(this._url);
            this._connectLock = false;
            this._ws.on('open', this._handleOpen);
            this._ws.on('close', this._handleClose);
            this._ws.on('message', this._handleMessage);
            this._ws.on('error', this._handleError);

            this._connectTimeout = setTimeout(() => {
                this._handleError(new Error('websocket timeout'))
            }, this._connectionTimeout);
        });
    }

    _disconnect(code = 1000) {
        // console.log('websocket disconnected');
        clearTimeout(this._connectTimeout);
        clearTimeout(this._acceptOpenTimeout);
        this._messageQueue = [];
        // this._pendingConfirms = [];
        this._retryCount = -1;
        
        if(!this._ws) return;
        this._ws.off('open', this._handleOpen);
        this._ws.off('close', this._handleClose);
        this._ws.off('message', this._handleMessage);
        this._ws.off('error', this._handleError);
        if(this._ws.readyState === WebSocket.OPEN || this._ws.readyState === WebSocket.CONNECTING) {
            try {
                this._ws.close(code);
            } catch(err) { }
        }
        this._ws = null;
    }

    _reconnect() {
        // console.log('websocket reconnecting...');
        this._disconnect();
        this.emit('reconnect');
        this._connect();
    }

    _wait(delay) {
        return new Promise((resolve, reject) => { setTimeout(resolve, delay); });
    }

    _send(message) {
        if(this._ws && this._ws.readyState === WebSocket.OPEN) {
            this._ws.send(message);
        } else {
            this._messageQueue.push(message);
        }
    }

    _handleOpen(event) {
        clearTimeout(this._connectTimeout);
        
        // send queued messages
        while(this._messageQueue.length > 0 && this._ws.readyState === WebSocket.OPEN) {
            this._send(this._messageQueue.shift());
        }

        this._acceptOpenTimeout = setTimeout(() => {
            // console.log('websocket connected');
            this.emit('open', event);
            this._retryCount = -1;
        }, 5000);
    }

    _handleClose(event) {
        this.emit('close', event);
        this._reconnect();
    }

    _handleMessage(message) {
        this.emit('message', message);
    }

    _handleError(event) {
        // console.error('websocket error: ', event.message);
        this.emit('error', event);
        this._reconnect();
    }

    send(message) {
        this._send(message);
    }

    close() {
        clearInterval(this._refreshInterval);
    }
}

module.exports = ReconnectWS;