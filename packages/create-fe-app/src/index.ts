
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
const homeDir = path.join(baseDir, '.create-fe-app');
const pluginDir = path.join(homeDir, 'node_modules');

const ymlPath = path.join(workDir, '.create-fe-app.yml');
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
            checkUpdates('create-fe-app','latest', registry);
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
    const cli = new CLI(args)

    cli.logger.debug(Date.now())
    cli.logger.debug(cmd);

    return cli.init().then(()=>{
        let c = cli.cmd.get(cmd)
        if(!c) cmd = 'help'
        return cli.call(cmd, args).then(()=>{
            cli.logger.info(`${cmd} done`)
        })
    })
}

export default entry

module.exports = entry