const path = require('path');
const util = require('./util');
const config = util.getConfig();
const apolloStream = require(path.join(util.dirs().core, 'apolloStream'));
const Market = require(path.join(util.dirs().markets, "realtime"));

class pipeline {
    constructor(config) {
        this.plugins = [];
        this.stream = new apolloStream(this.plugins);
        this.market = new Market(config);

        this.loadPlugins();
    }

    setupMarket(config) {
        market.pipe(this.stream);
    }

    loadPlugins() {
        const pluginDir = util.dirs().plugins;
        let pluginMeta = require(path.join(util.dirs().root, "plugins.js"));
        pluginMeta.forEach(plugin => {
            if(plugin.modes.includes(config.mode)) {
                let pluginPath = path.join(pluginDir, plugin.slug);
                let pluginType = require(pluginPath);
                let pluginInstance = new pluginType();
                this.plugins.push(pluginInstance);
            }
        });
    }
}

module.exports = pipeline;