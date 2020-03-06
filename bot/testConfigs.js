let c1  = {
    mode: "paper",
    watch: {
        currency: "USDT",
        asset: "BTC",
    },
    advisor: {
        strategy: {
            name: 'myStrategy',
            params: {requiredHistory: 5}
        }
    },
    portfolio: {
        asset: 1,
        currency: 100
    }
};

let c2  = {
    mode: "realtime",
    watch: {
        currency: "BTC",
        asset: "BNB",
    },
    advisor: {
        strategy: {
            name: 'myStrategy',
            params: []
        }
    },
};

let c3  = {
    mode: "realtime",
    watch: {
        currency: "BTC",
        asset: "ZEC",
    },
    advisor: {
        strategy: {
            name: 'myStrategy',
            params: []
        }
    },
};

let c4  = {
    mode: "paper",
    watch: {
        currency: "BTC",
        asset: "EOS",
    },
    advisor: {
        strategy: {
            name: 'myStrategy',
            params: []
        }
    },
};

let c5  = {
    mode: "paper",
    watch: {
        currency: "BTC",
        asset: "XRP",
    },
    advisor: {
        strategy: {
            name: 'myStrategy',
            params: []
        }
    },
};

let c6  = {
    mode: "backtest",
    watch: {
        currency: "BTC",
        asset: "ETH",
    },
    daterange: {
        from: '',
        to: ''
    },
    advisor: {
        strategy: {
            name: 'myStrategy',
            params: []
        }
    },
};

module.exports = {c1, c2, c3, c4, c5, c6}