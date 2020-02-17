const advisor = require('./advisor');
const trader = require('./trader');

class pipeline {
    constructor(config) {
        this.config = config;
        this.advisor = new advisor(config);
        this.trader = new trader(config);
        this.plugins = {};

        this.setup();
        this.loadPlugins();
        this.subscribePlugins();
    }

    setup() {
        this.advisor.on('advice', advice => {
            this.trader(processAdvice);
        })
    }

    loadPlugins() {
        let pluginMeta = require('../plugins/plugins');
        const mode = this.config.mode;

        pluginMeta.forEach(plugin => {
            if(plugin.enabled) {
                if(plugin.modes.includes(mode)) {
                    let pluginType = require('../plugins/' + plugin.slug);
                    try {
                        let pluginInstance = new pluginType(this.config);
                        pluginInstance.meta = plugin;
                        this.plugins[plugin.slug] = pluginInstance;
                    } catch(err) {
                        console.log("EISH " + err);
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

    candle(candle) {
        this.advisor.processCandle(candle);
        this.trader.processCandle(candle);
        for(const pluginSlug in this.plugins) {
            let plugin = this.plugins[pluginSlug];
            if(plugin.meta.candleConsumer) {
                plugin.processCandle(candle);
            }
        }
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