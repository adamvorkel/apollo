let live_btc  = {
    pair: "BTC/USDT",
    strategy: {
        name: 'myStrategy',
        params: { candleSize: 5, requiredHistory: 21 }
    }
};

let paper_eos  = {
    pair: "EOS/BTC",
    strategy: {
        name: 'myStrategy',
        params: { candleSize: 5 }
    },
    portfolio: {
        asset: 1,
        currency: 100
    }
};

module.exports = { live_btc, paper_eos };