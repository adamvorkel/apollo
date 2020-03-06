const {EventEmitter} = require('events');
const stops = require('../stops');

class PaperTrader extends EventEmitter {
    constructor(config) {
        super();
        this.config = config;
        this.portfolio = config.portfolio;
        this.balance = null;
        this.fee = 0.0015;
        this.activeStop = null;

        this.processAdvice = this.processAdvice.bind(this);
        this.createOrder = this.createOrder.bind(this);
    }

    processCandle(candle) {
        this.price = candle.close;
        console.log(`${this.config.watch.asset} PaperTrader:  ${this.price} ${this.config.watch.currency}`);
        this.balance = this.portfolio.currency + this.price * this.portfolio.asset;
        
        if(this.activeStop) this.activeStop.update(this.price);
    }

    processAdvice(advice) {
        // check if exposed here?
        if(advice.action === 'buy') {

        } else if(advice.action === 'sell') {

        }

        //create order here
        this.createOrder(advice);
    }

    async createOrder(advice) {
        //create stop
        console.log('Recieved advice to ' + advice.action);
        if(advice.stop) this.createStop(advice.stop);
        return Promise.resolve("test");
    }

    createStop(stop) {
        if(stop.type === 'trail') {
            this.activeStop = new stops.TrailingStop(stop.price, stop.trail);
            this.activeStop.on('trigger', async (advice) => {
                await this.createOrder(advice);
                this.removeStop();
            });
            
        }
    }

    removeStop() {
        console.log('Deleting stop...')
        this.activeStop = null;
    }



}

module.exports = PaperTrader;