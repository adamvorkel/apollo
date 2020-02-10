const path = require('path');
const util = require('./util');

class pipeline {
    constructor(config) {
        this.config = config;
        this.plugins = {};

        this.loadPlugins();
        this.subscribePlugins();
    }

    loadPlugins() {
        const pluginDir = util.dirs().plugins;
        let pluginMeta = require('../plugins/plugins');
        const mode = this.config.mode;

        pluginMeta.forEach(plugin => {
            if(plugin.enabled) {
                if(plugin.modes.includes(mode)) {
                    let pluginPath = path.join(pluginDir, plugin.slug);
                    
                    let pluginType = require(pluginPath);
                    try {
                        let pluginInstance = new pluginType(this.config[plugin.slug]);
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