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

    // returns a promise that resolves to the open websocket
    _setupWS(address, isCombined) {
        return new Promise((resolve, reject) => {
            if(this._sockets[address]) {
                return this._sockets[address];
            }

            address = (isCombined ? this._combinedBaseUrl : this._baseURL) + address;

            const ws = new WebSocket(address);

            ws.on('open', () => {
                resolve(ws);
            });

            return ws;
        });

        
        
        
    }

    onDepthUpdate(symbol) {
        return this._setupWS(this.streams.depth(symbol))
    }

    onDepthLevelUpdate(symbol) {
        return this._setupWS(this.streams.depthLevel(symbol));
    }

    onKline(symbol, interval) {
        return this._setupWS(this.streams.kline(symbol, interval));
    }

    onAggTrade(symbol) {
        return this._setupWS(this.streams.depth(symbol))
    }

    onTrade(symbol) {
        return this._setupWS(this.streams.depth(symbol));
    }

    onTicker(symbol) {
        return this._setupWS(this.streams.ticker(symbol));
    }

    onAllTickers(symbol) {
        return this._setupWS(this.streams.allTickers(symbol));
    }

    onUserData(binanceRest, interval = 60000) {
        return binanceRest.startUserDataStream()
            .then((response) => {
                setInterval(() => {
                    binanceRest.keepAliveUserDataStream(response);
                }, interval);
                return this._setupWS(response.listenKey);
            })
    }

    onCombinedStream(streams) {
        return this._setupWS(streams.join('/'), true)
    }
}

module.exports = BinanceWS;