
import path from 'path';
import process from 'process';
import osenv from 'osenv';
import minimist from 'minimist';
import fs from 'fs-extra';
import vm from 'vm';
import { Command } from './command';
import initClient from "./initClient";
import loadPlugins from './loadPlugins';
import { createLogger } from './utils/logger';
import Generator from "./generator";
import Builder from "./builder";
import Install from "./utils/install";
import checkUpdates from './utils/checkUpdate';
import Help from './utils/help'
// import parseYaml from './utils/parseYml';

const pkg = require('../package.json')

const baseDir = osenv.home();
const workDir = process.cwd();
const homeDir = path.join(baseDir, '.fe-cli');
const pluginDir = path.join(homeDir, 'node_modules');

const ymlPath = path.join(workDir, '.fe-cli.yml');
/**
 * CORE
 */
export
class CLI {
    cmd: CustomTS;
    homeDir: pathName;
    pluginDir: pathName;
    logger: CustomTS;
    install: CustomTS;
    baseDir: pathName;
    workDir: pathName;
    config: CustomTS;
    args: minimist.ParsedArgs
    version: String;

    constructor(args: minimist.ParsedArgs) {
        this.homeDir = homeDir;
        this.pluginDir = pluginDir;
        this.cmd = new Command();
        this.workDir = workDir;
        this.baseDir = homeDir;
        this.args = args;
        this.version = pkg.version
        // todo
        // this.config = parseYaml(ymlPath) || {};
        this.config = {}
        this.logger = createLogger(this);
    }

    async init(){
        // 注入ctx 注册插件
        await initClient(this);
        await loadPlugins(this);

        await Generator(this);
        await Install(this);
        await Builder(this);
        await Help(this);

        return Promise.resolve().then((p)=> {
            this.logger.info('initial done');
        })
    }

    call(name: string, args: CustomTS, callback?: Function) {
        if (!callback && typeof args === 'function') {
            callback = args;
            args = {};
        }

        const self = this;

        return new Promise(function (resolve, reject) {
            const c = self.cmd.get(name);

            if (c) {
                c.call(self, args).then(resolve, reject);
            } else {
                reject(new Error('Command `' + name + '` has not been registered yet!'));
            }
        })
    }

    // todo
    checkUpdate(){
        if (typeof this.config == 'object' && this.config != null) {
            const { registry } = this.config;
            checkUpdates('fe-cli','latest', registry);
        }
    }

    /**
     * vm run script
     * inject ctx
     * @param path 
     */
    loadPlugins(path: pathName){
        return fs.readFile(path).then((script: Buffer | string)=>{

            script = `
                ;(function(ctx){
                    ${script}
                })(${this})
            `
            vm.runInThisContext(script)

        })
        // fs.readFileSync()
    }
}

const entry = () => {
    const args = minimist(process.argv.slice(2))
    let cmd = args._.shift()
    const demo = new CLI(args)

    demo.logger.debug(Date.now())
    demo.logger.debug(cmd);

    return demo.init().then(()=>{
        let c = demo.cmd.get(cmd)
        if(!c) cmd = 'help'
        return demo.call(cmd, args).then(()=>{
            demo.logger.info(`${cmd} done`)
        })
    })
}

export default entry

module.exports = entry