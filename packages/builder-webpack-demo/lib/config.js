"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var Config = /** @class */ (function () {
    function Config() {
    }
    /**
     * @function getPath
     * @desc     Find cli-demo.json file
     */
    Config.getPath = function (filename) {
        var currDir = process.cwd();
        while (!fs_1.default.existsSync(path_1.default.join(currDir, filename))) {
            currDir = path_1.default.join(currDir, '../');
            // unix跟目录为/， win32系统根目录为 C:\\格式的
            if (currDir === '/' || /^[a-zA-Z]:\\$/.test(currDir)) {
                return '';
            }
        }
        return currDir;
    };
    /**
     * @function getBuildConfig
     * @desc     Find builder type in cli-demo.json
     */
    Config.getBuildConfig = function () {
        var builderOptions;
        if (Config.getPath('cli-demo.json')) {
            var jsonConfigFile = path_1.default.join(Config.getPath('cli-demo.json'), './cli-demo.json');
            var fileContent = fs_1.default.readFileSync(jsonConfigFile, 'utf-8');
            var cliDemoCfg = void 0;
            try {
                cliDemoCfg = JSON.parse(fileContent);
            }
            catch (ex) {
                console.error('请确保cli-demo.json配置是一个Object类型，并且含有builderOptions字段');
            }
            builderOptions = cliDemoCfg.builderOptions;
            if (!builderOptions) {
                console.error('请确保cli-demo.js配置包含builderOptions字段，且内容不为空');
                return {};
            }
            return builderOptions;
        }
        else if (Config.getPath('cli-demo.js')) {
            var jsConfigFile = path_1.default.join(Config.getPath('cli-demo.js'), './cli-demo.js');
            var cliDemoCfg = require(jsConfigFile);
            builderOptions = cliDemoCfg.builderOptions;
            if (!builderOptions) {
                console.error('请确保cli-demo.js配置包含builderOptions字段，且内容不为空');
                return {};
            }
            return builderOptions;
        }
        else {
            console.error('未找到 cli-demo 配置文件 cli-demo.json 或者 cli-demo.js');
            return {};
        }
    };
    return Config;
}());
exports.default = Config;
