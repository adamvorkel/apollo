const EventEmitter = require('events');

class Trader extends EventEmitter {
    constructor(config) {
        super();
        this.config = config;

        this.price = null;
        this.exposed = false;
        this.activeStop = null;
        this.orders = [];

        this.processAdvice = this.processAdvice.bind(this);
        this.createOrder = this.createOrder.bind(this);
    }

    processCandle(candle) {
        this.price = candle.close;
        if(this.activeStop) this.activeStop.update(this.price);
        console.log(`${this.config.pair} trader:  ${this.price}`);
    }

    processAdvice(advice) {
        if(advice.action === 'buy') {
            if(this.exposed) {
                // cancel pending sell order if any
                return;
            }
        } 
        else 
        if(advice.action === 'sell') {
            if(!this.exposed) {
                // cancel pending buy order if any
                return;
            }
        }

        //create order here
        this.createOrder(advice);
    }

    async createOrder(advice) {
        //create stop
        //console.log('Recieved advice to ' + advice.action);
        if(advice.stop) this.createStop(advice.stop);
        return Promise.resolve("test");
    }

    createStop(stop) {
        if(stop.type === 'trail') {
            this.activeStop = new stops.TrailingStop(stop.price, stop.trail);
            // when stop gets triggered, sell
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

module.exports = Trader;