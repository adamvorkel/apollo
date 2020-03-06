const {EventEmitter} = require('events');

class TrailingStop extends EventEmitter {
    constructor(price, trail) {
        super();
        this.trail = trail;
        this.stop = price * (1 - trail / 100);
        this.triggered = false;
        console.log(`Creating trailing stop with trail ${trail}`);
        console.log(`Current price ${price}, stop ${this.stop}`);
    }

    update(price) {
        if(this.triggered) return;

        if(price > this.stop / (1 - this.trail / 100)) {
            this.stop = price * (1 - this.trail / 100);
            console.log(`Current price ${price}, stop ${this.stop} -> shifting`);
        } else if(price <= this.stop) {
            console.log(`Current price ${price}, stop ${this.stop} -> trigger`);
            this.emit('trigger', {
                action: 'sell'
            });
            this.triggered = true;
        } else {
            console.log(`Current price ${price}, stop ${this.stop} -> nothing`);
        }
        
    }
}

class PaperTrader extends EventEmitter {
    constructor(config) {
        super();
        this.portfolio = config.portfolio;
        this.balance = null;
        this.fee = 0.0015;
        this.activeStop = null;
    }

    processCandle(candle) {
        const price = candle.close;
        this.balance = this.portfolio.currency + price * this.portfolio.asset;
        
        if(this.activeStop) this.activeStop.update(price);
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
            this.activeStop = new TrailingStop(stop.price, stop.trail);
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