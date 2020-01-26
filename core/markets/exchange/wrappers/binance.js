const crypto = require('crypto');
const request = require('request');

class Binance {
    constructor(config) {
        this._baseURL = 'https://api.binance.com/';
        this.recvWindow = 5000;
        this.timeout = 15000;
        this._drift = 0;

        this.key = config.watch.key;
        this.secret = config.watch.secret;
        this.currency = config.watch.currency.toUpperCase();
        this.asset = config.watch.asset.toUpperCase();
        this.pair = this.asset + this.currency;
    }

    // startTimeSync() {
    //     setInterval(() => {
    //         this._getDrift().then(drift => {this._drift = drift; console.log(`DRIFT UPDATED: ${this._drift}`)});
    //     }, 30000);
    // }

    _getTime() {
        return new Date().getTime();
    }

    async _getDrift() {
        const systemTime = this._getTime();
        let serverTime = await this.time();
        serverTime = serverTime.serverTime;
        let transitTime = parseInt((this._getTime() - systemTime) / 2);
        let drift = serverTime - (systemTime + transitTime);
        return drift;
    }

    async time() {
        let serverTime = await this._makeRequest({}, 'api/v3/time');
        return serverTime;
    }

    _sign(queryString) {
        return crypto
            .createHmac('sha256', this.secret)
            .update(queryString)
            .digest('hex');
    }

    _setTimestamp(query) {
        if(!query.timestamp) {
            query.timestamp = this._getTime() + this._drift;
        }
    }

    _makeRequest(query, route, security, method, attempt = 0) {
        return new Promise((resolve, reject) => {
            
            // Add recvWindow to query object
            if(security === 'SIGNED' && this.recvWindow) {
                query.recvWindow = this.recvWindow;
            }
    
            //turn query object into query string
            let queryParams = [];
            for(var prop in query) {
                if(query.hasOwnProperty(prop)) {
                    queryParams.push(`${encodeURIComponent(prop)}=${encodeURIComponent(query[prop])}`);
                }
            }
            let queryString = queryParams.join("&");

            const options = {
                url: `${this._baseURL}${route}?${queryString}`,
                timeout: this.timeout
            };
    
            //add signature to query string
            if(security === 'SIGNED') {
                if (options.url.substr(options.url.length - 1) !== '?') {
                    options.url += '&';
                }
                options.url += `signature=${this._sign(queryString)}`;
            }
    
            if(security === 'API-KEY' || security === 'SIGNED') {
                options.headers = {'X-MBX-APIKEY': this.key};
            }
    
            if(method) {
                options.method = method;
            }
    
            request(options, (err, response, body) => {
                let payload = JSON.parse(body);
                if(err) {
                    reject(err)
                } else if(response.statusCode < 200 || response.statusCode > 299) {
                    if(response.statusCode === 400 && payload.code === -1021 && attempt === 0) {
                        //handle time drift and try query again
                        this._getDrift().then(drift => {
                            console.log("DRIFTING");
                            this._drift = drift;
                            query.timestamp = _setTimestamp(query);
                            return this._makeRequest(query, route, security, method, ++attempt);
                        });
                    }
                   
                   reject(new Error(`Response code ${response.statusCode}`), body);
                } else {
                    //all went well
                    resolve(payload);
                };
            });
        });
    }

    getTrades(since) {
        //return 
        let query = {
            symbol: this.pair,
            startTime: since,
            endTime: Date.UTC(2020, 0, 24, 17, 0, 30)
        };

        this._makeRequest(query, 'api/v3/aggTrades')
        .then(data => {
            console.log(data)
        })
        .catch(error => {
            console.log(`ERRRRROR: ${error}`);
        })

        return new Promise((res, rej) => {
            setTimeout(() => {
                // let newTrades = [
                //     {tid: 1, price: 10, date: "", amount: 12},
                //     {tid: 2, price: 10, date: "", amount: 12},
                //     {tid: 3, price: 10, date: "", amount: 12},
                //     {tid: 4, price: 10, date: "", amount: 12}
                // ];
                res([]);
            }, 200)
        });
    }
    

    aggTrades(query) {
        return this._makeRequest(query, "api/v3/aggTrades");
    }

    //SIGNED requests

    async account(query = {}) {
        this._setTimestamp(query);
        let accountInfo = await this._makeRequest(query, 'api/v3/account', 'SIGNED');
        return accountInfo;
    }

    async getPortfolio() {
        let accountInfo = await this.account();
        return accountInfo.balances.filter(asset => {
            return parseFloat(asset.free) > 0 || parseFloat(asset.locked) > 0;
        });
    }

    async getFee() {
        let accountInfo = await this.account();
        let fee = accountInfo.makerCommission / 10000;
        return fee;
    }

    allOrders(query = {}) {
        this._setTimestamp(query);
        return this._makeRequest(query, 'api/v3/allOrders', 'SIGNED');
    }

    openOrders(query) {
        this._setTimestamp(query);
        return this._makeRequest(query, "api/v3/openOrders", "SIGNED");
    }

    allOrders(query) {
        this._setTimestamp(query);
        return this._makeRequest(query, "api/v3/allOrders", "SIGNED");
    }

    newOrder(query) {
        this._setTimestamp(query);
        return this._makeRequest(query, "api/v3/order", "SIGNED", "POST")
    }

    cancelOrder(query) {
        this._setTimestamp(query);
        return this._makeRequest(query, "api/v3/order", "SIGNED", "DELETE")
    }

    myTrades(query) {
        this._setTimestamp(query);
        return this._makeRequest(query, "api/v3/myTrades", "SIGNED");
    }

    //API methods
    historicalTrades(query) {
        return this._makeRequest(query, "api/v3/historicalTrades", "API-KEY");
    }
}

const foo = new Binance({
    watch: {
        exchange: "binance",
        currency: "USDT",
        asset: "BTC",
        tickrate: 20,
        key: "gB8NBOByVIqXuAJxbPr266pPgpmJh4bAJz3UXg9ttBUNwde1Zt5K5kCgsd8u5193",
        secret: "YYEjznijxEqaGemsEudwIxmGVQZpI4q7XkrXD0lzL4g21djgltZmvdcyqJW4bi73"
    }
});

// foo.newOrder({
//     symbol: "BTCUSDT", 
//     side: "SELL",
//     type: "LIMIT",
//     timeInForce: "GTC",
//     quantity: 0.01,
//     price: 9000
// })
// .then(res => {
//     console.log("ORDER CREATED")
// })
// .catch(error => {
//     console.log(error)
// })

// foo.openOrders({symbol: "BTCUSDT"})
// .then(res => {
//     console.log(res)
// })

// foo.cancelOrder({symbol: "BTCUSDT", orderId: 1078399319})
// .then(res => {
//     console.log(`CANCELLED ${res}`);
// })

foo._getDrift().then(res => console.log(res))

module.exports = Binance;