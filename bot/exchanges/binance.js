const crypto = require('crypto');
const request = require('request');
const axios = require('axios');
const querystring = require('querystring');
const BinanceWS = require('./binanceWS');

class Binance {
    constructor(config) {
        this.config = config;
        this.api = axios.create({
            baseURL: 'https://api.binance.com/',
            method: 'get',
            timeout: config.timeout || 15000
        });
        
        this._drift = 0;
        this._key = config.watch.key;
        this._secret = config.watch.secret;
    }

    _getTime() {
        return new Date().getTime();
    }

    _getTimestamp() {
       return this._getTime() + this._drift;
    }

    _getSignature(params) {
        return crypto
            .createHmac('sha256', this._secret)
            .update(querystring.encode(params))
            .digest('hex');
    }

    async _request(config, security = 'NONE', retries = 0) {
        if(security === 'API-KEY' || security === 'SIGNED') {
            config.headers = {'X-MBX-APIKEY': this._key};
        }

        if(security === 'SIGNED') {
            config.params = {
                recvWindow: this.config.recvWindow || 5000, // add recvWindow
                timestamp: this._getTimestamp(), // add timestamp,
                ...config.params
            }
            config.params.signature = this._getSignature(config.params); // add signature
        }
        
        let state = {currentyRetry: 0, nextDelay: 0};
        const onSuccess = response => response;
        const onError = err => {
            if(!shouldRetry(err)) return Promise.reject(err);
            state.currentyRetry++;
            let lastDelay = state.nextDelay;
            state.nextDelay = state.currentyRetry * 1000;
            return Promise.resolve(err)
            .then(err => onRetry(err))
            .then(err => backOff(err, state.nextDelay))
            .then(err => this.api.request(err.config));
        }

        const shouldRetry = err => {
            if(state.currentyRetry >= retries) return false;
            let httpMethodsToRetry = [ 'GET', 'HEAD', 'PUT', 'OPTIONS', 'DELETE' ];
            if(!httpMethodsToRetry.includes(err.config.method.toUpperCase())) return false;
            let status = err.response.status;
            if(!((status >= 100 && status <= 199) ||
                (status >= 500 && status <= 599) ||
                (status >= 400 && status <= 499))) return false;
            return true;
        }

        const backOff = (err, delay) => new Promise(res => setTimeout(() => {res(err)}, delay));

        const onRetry = async err => {
            try {
                if(err.response.status >= 400 && err.response.status <= 499 && err.response.data.code === -1021) {
                    //update time drift
                    await this._refreshDrift();
                    err.config.params.timestamp = this._getTimestamp();
                }
            } catch(error) { }
            return err;
        };

        this.api.interceptors.response.use(onSuccess, onError);
            
        //do request
        let response = await this.api.request(config);
        return response.data;
    }

    async _getServerTime() {
        let response = await this._request({url: 'api/v3/time'}); 
        return response.serverTime;
    }

    async _refreshDrift() {
        const systemTime = this._getTime();
        const serverTime = await this._getServerTime();
        const transitTime = parseInt((this._getTime() - systemTime) / 2);
        this._drift = serverTime - (systemTime + transitTime);
    }

    async aggTrades(params) {
        return this._request({url: 'api/v3/aggTrades', params});
    }

    async klines(params) {
        return this._request({url: 'api/v3/klines', params});
    }

    //API methods
    async historicalTrades(params) {
        return this._request({url: 'api/v3/historicalTrades', params}, 'API-KEY');
    }

    //SIGNED requests
    async account() {
        return this._request({url: 'api/v3/account'}, 'SIGNED', 3);
    }

    async allOrders(params) {
        return this._request({url: 'api/v3/allOrders', params}, 'SIGNED', 3);
    }

    async openOrders(params) {
        return this._request({url: 'api/v3/openOrders', params}, 'SIGNED', 3);
    }

    async createOrder(params) {
        return this._request({url: 'api/v3/order', method: 'POST', params}, 'SIGNED', 3);
    }

    async cancelOrder(params) {
        return this._request({url: 'api/v3/order', method: 'DELETE', params}, 'SIGNED', 3);
    }

    async getPortfolio() {
        let acc = await this.account();
        return acc.balances
        .filter(asset => parseFloat(asset.free) > 0 || parseFloat(asset.locked) > 0);
    }

    async getFee() {
        let acc = await this.account();
        return acc.makerCommission / 10000;
    }

    async getMyTrades(params) {
        return this._request({url: 'api/v3/myTrades', params}, 'SIGNED', 3);
    }

    async buy(symbol, quantity, price) {
        return this.createOrder({
            symbol,
            quantity,
            price,
            side: 'BUY',
            type: 'LIMIT',
            timeInForce: 'GTC'
        });
    }

    async sell(symbol, quantity, price) {
        return this.createOrder({
            symbol,
            quantity,
            price,
            side: 'SELL',
            type: 'LIMIT',
            timeInForce: 'GTC'
        });
    }

    async _openUserDataStream() {
        return this._request({url: '/api/v3/userDataStream', method: 'POST'}, 'API-KEY');
    }

    async _refreshUserDataStream(listenKey) {
        return this._request({url: '/api/v3/userDataStream', method: 'PUT', params: {listenKey}}, 'API-KEY');
    }

    async __closeUserDataStream(listenKey) {
        return this._request({url: '/api/v3/userDataStream', method: 'DELETE', params: {listenKey}}, 'API-KEY');
    }

    getConnection() {
        let connection = new BinanceWS();
        return connection;
    }

    async getAccountConnection() {
        let { listenKey } = await this._openUserDataStream();
        setInterval(() => this._refreshUserDataStream(listenKey), 30*60*1000);
        let connection = new BinanceWS();
        connection.getStream(listenKey);
        return connection;
    }
}

// const exchange = new Binance({
//     watch: {
//         key: "gB8NBOByVIqXuAJxbPr266pPgpmJh4bAJz3UXg9ttBUNwde1Zt5K5kCgsd8u5193",
//         secret: "YYEjznijxEqaGemsEudwIxmGVQZpI4q7XkrXD0lzL4g21djgltZmvdcyqJW4bi73",
//     }
// });


module.exports = Binance;