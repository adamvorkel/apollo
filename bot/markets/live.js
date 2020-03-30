class Live {
    constructor(exchange) {
        this.exchange = exchange;
        this.connections = new Map();
        this.tickers = new Map();

        // this.startTicker();
    }

    async startTicker() {
        let endpoint = '!ticker@arr';
        let connection = this.exchange.getConnection();
        this.connections.set("tickers", connection);
        let tickerStream = await connection.getStream(endpoint);
        tickerStream.on('data', tickers => {
            console.log("TICKERS", tickers.length);
        });
    }

    getTickers() {

    }

    async getKlineStream(pair) {
        if(!this.connections.has(pair)) 
            this.connections.set(pair, this.exchange.getConnection());

        let connection = this.connections.get(pair);
        let klineStream = await connection.getKlineStream(pair);
       
        return klineStream;
    }
}

module.exports = Live;