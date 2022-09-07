"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initClient = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
class initClient {
    constructor(ctx) {
        this.ctx = ctx;
    }
    // todo: init .log files
    initLogs() {
        const ctx = this.ctx;
        const homeDir = ctx.homeDir;
        const logDir = path_1.default.join(homeDir, 'logs');
        const exist = fs_extra_1.default.existsSync(logDir);
        let promise = Promise.resolve();
        if (!exist) {
            promise = fs_extra_1.default.mkdir(logDir);
        }
        return promise;
    }
    initRc() {
        const ctx = this.ctx;
        const homeDir = ctx.homeDir;
        const rcPath = path_1.default.join(homeDir, '.create-fe-app.yml');
        const exist = fs_extra_1.default.existsSync(rcPath);
        let promise = Promise.resolve();
        if (!exist) {
            promise = fs_extra_1.default.writeFile(rcPath, JSON.stringify({
                "registry": "https://r.npm.taobao.org",
                "proxy": ""
            }, null, 4));
        }
        return promise;
    }
    initHome() {
        const ctx = this.ctx;
        const homeDir = ctx.homeDir;
        const exist = fs_extra_1.default.existsSync(homeDir);
        let promise = Promise.resolve();
        if (!exist) {
            promise = fs_extra_1.default.mkdir(homeDir);
        }
        return promise;
    }
    initPkg() {
        const ctx = this.ctx;
        const pkgPath = path_1.default.join(ctx.homeDir, 'package.json');
        let promise = Promise.resolve();
        if (!fs_extra_1.default.existsSync(pkgPath)) {
            promise = fs_extra_1.default.writeFile(pkgPath, JSON.stringify({
                "name": "create-fe-app-home",
                "version": "0.0.0",
                "private": true
            }, null, 4));
        }
        return promise;
    }
}
exports.initClient = initClient;
exports.default = (ctx) => {
    const client = new initClient(ctx);
    return Promise.all([
        client.initHome(),
        client.initLogs(),
        client.initRc(),
        client.initPkg(),
    ]);
};
