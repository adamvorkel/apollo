const WebSocket = require('ws');

class BinanceWS {
    constructor() {
        this._baseURL = "wss://stream.binance.com:9443/ws/";
        this._combinedBaseUrl = 'wss://stream.binance.com:9443/stream?streams=';
        this._sockets = {};
        this.streams = {
            depth: (symbol) => `${symbol.toLowerCase()}@depth`,
            depthLevel: (symbol, level) => `${symbol.toLowerCase()}@depth${level}`,
            kline: (symbol, interval) => `${symbol.toLowerCase()}@kline_${interval}`,
            aggTrade: (symbol) => `${symbol.toLowerCase()}@aggTrade`,
            trade: (symbol) => `${symbol.toLowerCase()}@trade`,
            ticker: (symbol) => `${symbol.toLowerCase()}@ticker`,
            allTickers: () => '!ticker@arr'
        }
    }

    _setupWS(eventHandler, address, isCombined) {
        if(this._sockets[address]) {
            return this._sockets[address];
        }
        address = (isCombined ? this._combinedBaseUrl : this._baseURL) + address;
        const ws = new WebSocket(address);
        ws.on('message', (message) => {
            eventHandler(message);
        });
        
        ws.on('error', (err) => {

        });

        return ws;
    }

    onDepthUpdate(symbol, eventHandler) {
        return this._setupWS(eventHandler, this.streams.depth(symbol))
    }

    onDepthLevelUpdate(symbol, eventHandler) {
        return this._setupWS(eventHandler, this.streams.depthLevel(symbol));
    }

    onKline(symbol, eventHandler) {
        return this._setupWS(eventHandler, this.streams.kline(symbol));
    }

    onAggTrade(symbol, eventHandler) {
        return this._setupWS(eventHandler, this.streams.depth(symbol))
    }

    onTrade(symbol, eventHandler) {
        return this._setupWS(eventHandler, this.streams.depth(symbol));
    }

    onTicker(symbol, eventHandler) {
        return this._setupWS(eventHandler, this.streams.ticker(symbol));
    }

    onAllTickers(symbol, eventHandler) {
        return this._setupWS(eventHandler, this.streams.allTickers(symbol));
    }

    onUserData(binanceRest, eventHandler, interval = 60000) {
        return binanceRest.startUserDataStream()
            .then((response) => {
                setInterval(() => {
                    binanceRest.keepAliveUserDataStream(response);
                }, interval);
                return this._setupWS(eventHandler, response.listenKey);
            })
    }

    onCombinedStream(streams, eventHandler) {
        return this._setupWS(eventHandler, streams.join('/'), true)
    }
}

let bs = new BinanceWS();
let depth = bs.onKline("BNBBTC", "1m", (message) => {
    console.log(`MESSAGE: ${message}`)
});

console.log(`DEPTH ${depth}`)

// module.exports = BinanceWS;