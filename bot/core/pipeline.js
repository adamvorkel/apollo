const { Writable } = require('stream');

class pipeline extends Writable {
    constructor(config, advisor, trader) {
        super({objectMode: true});

        this.config = config;
        this.advisor = advisor;
        this.trader = trader;
        this.plugins = {};

        this.setup();
        this.loadPlugins();
        this.subscribePlugins();
    }

    setup() {
        // trader acts on advisors advice
        this.advisor.on('advice', this.trader.processAdvice);
    }

    loadPlugins() {
        let pluginMeta = require('../plugins/plugins');
        const mode = this.config.mode;

        pluginMeta.forEach(plugin => {
            if(plugin.enabled) {
                if(plugin.modes.includes(mode)) {
                    try {
                        let pluginType = require('../plugins/' + plugin.slug);
                        let pluginInstance = new pluginType(this.config);
                        pluginInstance.meta = plugin;
                        this.plugins[plugin.slug] = pluginInstance;
                    } catch(err) {
                        console.error(`Unable to load ${plugin.name} plugin`);
                    }
                }
            } 
        });
    }

    subscribePlugins() {
        for(const pluginSlug in this.plugins) {
            let plugin = this.plugins[pluginSlug];
            if(plugin.meta.subscriptions !== undefined) {
                //handle each subscription
                plugin.meta.subscriptions.forEach((sub) => {
                    let emitter = this.plugins[sub.emitter];
                    if(emitter) {
                        emitter.on(sub.event, plugin[sub.handler])
                    } else {
                        console.log(`${pluginSlug} wants to subscribe to ${sub.emitter} but it is not enabled`);
                        process.exit();
                    } 
                });
            }
        }
    }

    _write(candle, encoding, callback) {
        this.advisor.processCandle(candle);
        this.trader.processCandle(candle);
        for(const pluginSlug in this.plugins) {
            let plugin = this.plugins[pluginSlug];
            if(plugin.meta.candleConsumer) {
                plugin.processCandle(candle);
            }
        }
        callback();
    }

    finalize() {
        for(const pluginSlug in this.plugins) {
            let plugin = this.plugins[pluginSlug];
            if(plugin.finalize) {
                plugin.finalize();
            }
        }
    }
}

module.exports = pipeline;