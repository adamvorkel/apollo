const path = require('path');
const util = require('./util');
const config = util.getConfig();
const apolloStream = require('./apolloStream');
const fs = require('fs');

class pipeline {
    constructor(config) {
        this.config = config;
        this.plugins = {};

        this.loadPlugins();
        this.setupMarket();
        this.subscribePlugins();
        this.startStream();
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
                        let pluginInstance = new pluginType();
                        pluginInstance.meta = plugin;
                        this.plugins[plugin.slug] = pluginInstance;
                    } catch(err) {
                        console.log("EISH " + err);
                    }
                    
                    
                }
            } 
        });
    }

    setupMarket() {
        // const Market = require('./markets/realtime');
        // this.market = new Market(this.config);
        // this.market.run();
    }

    subscribePlugins() {
        for(const pluginSlug in this.plugins) {
            let plugin = this.plugins[pluginSlug];
            if(plugin.meta.subscriptions !== undefined) {
                //handle each subscription
                plugin.meta.subscriptions.forEach((sub) => {
                    if(sub.emitter === "market") {
                        // this.market.on(sub.event, plugin[sub.handler]);
                    } else {
                        let emitter = this.plugins[sub.emitter];
                        if(emitter) {
                            emitter.on(sub.event, plugin[sub.handler])
                        } else {
                            console.log(`${pluginSlug} wants to subscribe to ${sub.emitter} but it is not enabled`);
                            process.exit();
                        }
                    }
                    
                    
                });
            }
        }
    }

    candle(candle) {
        this.stream.write(candle);
    }

    startStream() {
        let candleConsumers = {};
        for(const pluginSlug in this.plugins) {
            let plugin = this.plugins[pluginSlug];
            if(plugin.meta.candleConsumer) {
                candleConsumers[pluginSlug] = plugin;
            }
        }

        this.stream = new apolloStream(candleConsumers);
        this.stream.on("finalize", () => {
            for(const pluginSlug in this.plugins) {
                let plugin = this.plugins[pluginSlug];
                if(plugin.finalize) {
                    plugin.finalize();
                }
            }
        });

        
        // this.market.pipe(this.stream);
        // this.market.on("end", () => {
            // console.log("Market stream ended")
        // })
    }
}

module.exports = pipeline;