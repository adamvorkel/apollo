class LiveBroker {
    constructor(exchange, portfolio) {
        this.exchange = exchange;
        this.portfolio = portfolio;
    }

    // async startSync() {
        // start update stream
        // let stream = await this.exchange.getAccountStream();
        // stream.on('data', data => {
            // console.log("ACCOUNT", data);
        // });

        // call api every 5 seconds
        // setInterval(() => {
            // this.sync();
        // }, 5000);
    // }

    async sync() {
        let balances = await this.exchange.getPortfolio();
        this.portfolio.set(balances);
    }

    buy() {

    }

    sell() {
        
    }
}

module.exports = LiveBroker;