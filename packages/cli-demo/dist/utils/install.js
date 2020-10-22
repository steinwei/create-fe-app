"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Install = void 0;
const cross_spawn_1 = __importDefault(require("cross-spawn"));
exports.default = (ctx) => {
    const cmd = ctx.cmd;
    const baseDir = ctx.baseDir;
    return cmd.register("install", (args) => new Install(ctx).execNpmCmd("install", args['_'][0], baseDir));
};
class Install {
    constructor(ctx) {
        this.ctx = ctx;
    }
    checkUpdate(plugins) {
        return new Promise((resolve, reject) => {
        });
    }
    execNpmCmd(cmd, modules, where) {
        const ctx = this.ctx;
        const { registry = '', proxy = '' } = ctx.config;
        return new Promise((resolve, reject) => {
            let args = [cmd].concat(modules);
            if (registry) {
                args = args.concat('--registry=${registry}');
            }
            else {
                args = args.concat('--registry=https://r.npm.taobao.org');
            }
            if (proxy) {
                args = args.concat(`--proxy=${proxy}`);
            }
            args = args.concat('--global-style').concat('--unsafe-perm');
            ctx.logger.debug(args);
            // 流存储log
            const npm = cross_spawn_1.default('npm', args, { cwd: where });
            let output = '';
            npm.stdout.on('data', (data) => {
                output += data;
            }).pipe(process.stdout);
            npm.stderr.on('data', (data) => {
                output += data;
            }).pipe(process.stderr);
            npm.on('close', (code) => {
                if (!code) {
                    resolve({ code: 0, data: output });
                }
                else {
                    reject({ code: code, data: output });
                }
            });
        });
    }
}
exports.Install = Install;
