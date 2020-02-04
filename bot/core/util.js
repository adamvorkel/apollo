const fs = require('fs');
const path = require('path');

let _config;
let _startTime = Date.now();

let util = {
    getConfig: () => {
        if(!_config) {
            let configPath = path.join(util.dirs().root, "config.js");
            if(!fs.existsSync(configPath)) {
                console.error(`No config file found at: ${configPath}`);
                process.exit(1);
            }
            _config = require(configPath);
        }

        return _config;
    },
    dirs: () => {
        let ROOT = path.join(__dirname, "/../");
        return {
            root: ROOT,
            core: path.join(ROOT, "/core/"),
            plugins: path.join(ROOT, "/plugins"),
            web: path.join(ROOT, "/web/"),
            markets: path.join(ROOT, "/core/markets")
        }
    },
    startTime: () => {
        return _startTime;
    },
    timeUp: () => {
        return Math.floor((Date.now()-_startTime) / 1000);
    }
};

module.exports = util;