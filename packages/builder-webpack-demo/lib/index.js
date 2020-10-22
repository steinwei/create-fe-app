"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var webpack_1 = __importDefault(require("webpack"));
var builder_1 = __importDefault(require("./builder"));
var config_1 = __importDefault(require("./config"));
var server_1 = __importDefault(require("./server"));
var utils_1 = require("./utils");
var builderOptions = config_1.default.getBuildConfig();
var devConfig = builder_1.default.createDevConfig(builderOptions);
var prodConfig = builder_1.default.createProdConfig(builderOptions);
function builderWebpack4(cmd) {
    if (cmd === 'dev') {
        server_1.default(devConfig);
    }
    else if (cmd === 'build') {
        webpack_1.default(prodConfig, function (err, stats) {
            if (err) {
                console.log(err);
                utils_1.postMessage.error(utils_1.BuilderType.build, err);
                process.exit(2);
            }
            utils_1.postMessage.success(utils_1.BuilderType.build);
            console.log(stats && stats.toString({
                chunks: false,
                colors: true,
                children: false
            }));
        });
    }
}
exports.default = builderWebpack4;
exports.default.devConfig = devConfig;
exports.default.prodConfig = prodConfig;
module.exports = exports.default;
