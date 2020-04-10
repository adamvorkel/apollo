let c1  = {
    pair: "BTC/USDT",
    strategy: {
        name: 'myStrategy',
        params: {
            candleSize: 5, 
            requiredHistory: 0
        }
    },
    portfolio: {
        asset: 1,
        currency: 100
    }
};

let c2  = {
    pair: "BNB/BTC",
    strategy: {
        name: 'myStrategy',
        params: []
    },
};

let c3  = {
    pair: "ZEC/BTC",
    strategy: {
        name: 'myStrategy',
        params: []
    },
};

let c4  = {
    pair: "EOS/BTC",
    strategy: {
        name: 'myStrategy',
        params: []
    },
};

let c5  = {
    pair: "XRP/BTC",
    strategy: {
        name: 'myStrategy',
        params: []
    }
};

let c6  = {
    pair: "BTC/USDT",
    daterange: {
        from: '',
        to: ''
    },
    strategy: {
        name: 'myStrategy',
        params: []
    },
};

module.exports = {c1, c2, c3, c4, c5, c6}