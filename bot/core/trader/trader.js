const EventEmitter = require('events');
const Portfolio = require('./portfolio');


class Trader extends EventEmitter {
    constructor(config, exchange) {
        super();
        this.config = config;
        this.exchange = exchange;

        this.price = null;

        this.position = null;
        this.stop = null;

        this.orders = {
            open: [],
            closed: []
        };

        this.processAdvice = this.processAdvice.bind(this);
        this.createOrder = this.createOrder.bind(this);
    }

    processTick(tick) {
        this.price = tick.price;
        if(this.stop) this.stop.update(this.price);
        console.log(`${this.config.pair} trader:  ${this.price}`);
    }

    processAdvice(advice) {
        if(advice.action === 'buy') {
            if(this.position) {
                // if(this.orders.open.length) 
                // cancel pending sell order if any

                return;
            }
        } 
        else 
        if(advice.action === 'sell') {
            if(!this.position) {
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

        let order = this.exchange.createOrder
        this.orders.open.push(
            new LimitOrder({ side: advice.action, amount: 5 })
        );
        
        
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