"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Builder = void 0;
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const cross_spawn_1 = __importDefault(require("cross-spawn"));
const config_1 = require("./config");
class Builder {
    constructor(ctx) {
        this.ctx = ctx;
    }
    execNpmCommand(cmd, modules, where, registry) {
        let args = [];
        args.concat(cmd).concat(modules);
        if (!registry) {
            args.concat('--registry https://r.npm.taobao.org');
        }
        args.concat('--global-style').concat('--unsafe-perm');
        // 流存储log
        const npm = cross_spawn_1.default("npm", args, { cwd: where });
        let output = '';
        npm.stdout.on("data", (data) => {
            output += data;
        });
        npm.on("close", () => {
            this.ctx.logger.info('installed successfully');
        });
        return Promise.resolve({
            code: 0,
            data: output
        });
    }
    runBuild(cmd) {
        const self = this;
        const { log, pluginDir, baseDir, logger } = this.ctx;
        return config_1.Config.getBuilderType().then((type) => {
            logger.debug(type);
            const pathname = path_1.default.join(pluginDir, type);
            if (!fs_extra_1.default.existsSync(pathname)) {
                log.info(`检测到您本地没有安装${type}构建器, 即将为您安装...`);
                // const loading = new Loading(`正在安装${type}，请稍等`);
                return this.execNpmCommand('install', type, baseDir).then(function (result) {
                    if (!result.code) {
                        // loading.success();
                        log.info(`${type} 构建器安装完成, 即将执行构建命令...`);
                        console.log('path', path_1.default);
                        require(pathname)(cmd, self.ctx);
                    }
                });
            }
            else {
                // console.log('path', path);
                // return this.checkUpdate().then(() => {
                require(pathname)(cmd, self.ctx);
                // });
            }
        });
    }
    checkUpdate() {
    }
    async loadBuilderList() {
        const ctx = this.ctx;
        const baseDir = ctx.baseDir;
        const pkg_dir = path_1.default.join(baseDir, 'package.json');
        const pluginDir = ctx.pluginDir;
        const deps_arr = fs_extra_1.default.readFile(pkg_dir).then((content) => {
            const json = JSON.parse(content);
            const deps = json.dependencies || json.devDependencies || {};
            return Object.keys(deps);
        });
        const res = (await deps_arr).filter(function (name) {
            // Find yeoman generator.
            // generator-ivweb
            if (!/^buidler-|^@[^/]+\/buidler-/.test(name))
                return false;
            // Make sure the generator exists
            const pathname = path_1.default.join(pluginDir, name);
            return fs_extra_1.default.existsSync(pathname);
        }).map(function (name) {
            const pathname = path_1.default.join(pluginDir, name);
            let packagePath = path_1.default.join(pathname, 'package.json');
            // Read generator config.
            return fs_extra_1.default.readFile(packagePath).then(function (content) {
                const json = JSON.parse(content);
                const desc = json.description;
                return { name, desc };
            });
        });
        return res;
    }
}
exports.Builder = Builder;
exports.default = (ctx) => {
    const cmd = ctx.cmd;
    cmd.register("dev", () => new Builder(ctx).runBuild("dev"));
    cmd.register("build", () => new Builder(ctx).runBuild("build"));
    return Promise.resolve();
};
