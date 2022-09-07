"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoadPlugins = void 0;
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
class LoadPlugins {
    constructor(ctx) {
        this.ctx = ctx;
    }
    loadModules() {
        const pluginDir = this.ctx.pluginDir;
        return this.loadModulesList().then((names) => {
            const name = path_1.default.join(pluginDir, names[0]);
            return this.ctx.LoadPlugins(name);
        });
    }
    // 确认模块存在
    loadModulesList() {
        const ctx = this.ctx;
        const pkgPath = ctx.pkgPath;
        return fs_extra_1.default.readFile(pkgPath).then((info) => {
            const json = JSON.parse(info) || {};
            const deps = json.devDependies || {};
            return Object.keys(deps);
        }).then((keys) => {
            return keys.filter((key) => {
                // create-fe-app-plugin
                return /^(cli\)(\w)+$/.test(key);
            });
        });
    }
}
exports.LoadPlugins = LoadPlugins;
exports.default = (ctx) => {
    const modules = new LoadPlugins(ctx);
    return Promise.resolve(modules);
};
