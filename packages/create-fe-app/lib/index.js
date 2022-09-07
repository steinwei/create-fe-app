"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CLI = void 0;
const path_1 = __importDefault(require("path"));
const process_1 = __importDefault(require("process"));
const osenv_1 = __importDefault(require("osenv"));
const minimist_1 = __importDefault(require("minimist"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const vm_1 = __importDefault(require("vm"));
const command_1 = require("./command");
const initClient_1 = __importDefault(require("./initClient"));
const loadPlugins_1 = __importDefault(require("./loadPlugins"));
const logger_1 = require("./utils/logger");
const generator_1 = __importDefault(require("./generator"));
const builder_1 = __importDefault(require("./builder"));
const install_1 = __importDefault(require("./utils/install"));
const checkUpdate_1 = __importDefault(require("./utils/checkUpdate"));
const help_1 = __importDefault(require("./utils/help"));
// import parseYaml from './utils/parseYml';
const pkg = require('../package.json');
const baseDir = osenv_1.default.home();
const workDir = process_1.default.cwd();
const homeDir = path_1.default.join(baseDir, '.create-fe-app');
const pluginDir = path_1.default.join(homeDir, 'node_modules');
const ymlPath = path_1.default.join(workDir, '.create-fe-app.yml');
/**
 * CORE
 */
class CLI {
    constructor(args) {
        this.homeDir = homeDir;
        this.pluginDir = pluginDir;
        this.cmd = new command_1.Command();
        this.workDir = workDir;
        this.baseDir = homeDir;
        this.args = args;
        this.version = pkg.version;
        // todo
        // this.config = parseYaml(ymlPath) || {};
        this.config = {};
        this.logger = logger_1.createLogger(this);
    }
    async init() {
        // 注入ctx 注册插件
        await initClient_1.default(this);
        await loadPlugins_1.default(this);
        await generator_1.default(this);
        await install_1.default(this);
        await builder_1.default(this);
        await help_1.default(this);
        return Promise.resolve().then((p) => {
            this.logger.info('initial done');
        });
    }
    call(name, args, callback) {
        if (!callback && typeof args === 'function') {
            callback = args;
            args = {};
        }
        const self = this;
        return new Promise(function (resolve, reject) {
            const c = self.cmd.get(name);
            if (c) {
                c.call(self, args).then(resolve, reject);
            }
            else {
                reject(new Error('Command `' + name + '` has not been registered yet!'));
            }
        });
    }
    // todo
    checkUpdate() {
        if (typeof this.config == 'object' && this.config != null) {
            const { registry } = this.config;
            checkUpdate_1.default('create-fe-app', 'latest', registry);
        }
    }
    /**
     * vm run script
     * inject ctx
     * @param path
     */
    loadPlugins(path) {
        return fs_extra_1.default.readFile(path).then((script) => {
            script = `
                ;(function(ctx){
                    ${script}
                })(${this})
            `;
            vm_1.default.runInThisContext(script);
        });
        // fs.readFileSync()
    }
}
exports.CLI = CLI;
const entry = () => {
    const args = minimist_1.default(process_1.default.argv.slice(2));
    let cmd = args._.shift();
    const cli = new CLI(args);
    cli.logger.debug(Date.now());
    cli.logger.debug(cmd);
    return cli.init().then(() => {
        let c = cli.cmd.get(cmd);
        if (!c)
            cmd = 'help';
        return cli.call(cmd, args).then(() => {
            cli.logger.info(`${cmd} done`);
        });
    });
};
exports.default = entry;
module.exports = entry;
