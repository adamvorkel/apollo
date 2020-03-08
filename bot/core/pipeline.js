const { Writable } = require('stream');

class pipeline extends Writable {
    constructor(config, advisor, trader, broker) {
        super({objectMode: true});

        this.config = config;
        this.advisor = advisor;
        this.trader = trader;
        this.broker = broker;
        this.plugins = new Map();

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
                        this.plugins.set(plugin.slug, pluginInstance);
                    } catch(err) {
                        console.error(`Unable to load ${plugin.name} plugin`);
                    }
                }
            } 
        });
    }

    subscribePlugins() {
        this.plugins.forEach((plugin, slug) => {
            if(plugin.meta.subscriptions) {
                plugin.meta.subscriptions.forEach(sub => {
                    if(this.plugins.has(sub.emitter)) {
                        this.plugins.get(sub.emitter).on(sub.event, plugin[sub.handler]);
                    } else {
                        throw new Error(`${slug} wants to subscribe to ${sub.emitter} but it is not enabled`);
                    }
                })
            }
        });
    }

    _write(candle, _, callback) {
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