const path = require('path');
let pluginMetadata = require(`../../plugins/plugins`);

class PluginManager {
    constructor(config) {
        this.mode = config.mode;
        this.plugins = new Map();

        this.loadPlugins();
        this.subscribePlugins();
    }

    loadPlugins() {
        pluginMetadata.forEach(pluginMeta => {
            if(pluginMeta.enabled && pluginMeta.modes.includes(mode)) {
                try {
                    let plugin = new require(`../../plugins/${pluginMeta.slug}`)(this.config);
                    plugin.meta = pluginMeta;
                    this.plugins.set(pluginMeta.slug, plugin);
                } catch(err) {
                    console.error(`Unable to load ${pluginMeta.name} plugin`);
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

    processCandle(candle) {
        // for (let [key, value] of myMap)
        for(let plugin of this.plugins.values()) {
            plugin.meta.candleConsumer && plugin.processCandle(candle)
        }
    }

    finalize() {
        for(let plugin of this.plugins.values()) {
            plugin.finalize && plugin.finalize();
        }
    }
}

module.exports = PluginManager;