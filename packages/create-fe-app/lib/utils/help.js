"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const meow_1 = __importDefault(require("meow"));
const os_1 = __importDefault(require("os"));
/**
 * beatify string
 * @param str
 * @param before length of space before str
 * @param total total length
 */
function beautify(str, before = 0, total) {
    const spaceLength = Math.max(0, total - before - str.length);
    return `${' '.repeat(before)}${str}${' '.repeat(spaceLength)}`;
}
function help(ctx) {
    const cmd = ctx.cmd;
    const internalCmds = [
        'init',
        'install',
        // 'uninstall',
        // 'lint',
        'dev',
        'build',
        'version',
        'help',
    ];
    const defaultMsgPrefix = `
    Usage: create-fe-app [options] [command]

    Commands:
        init                      Choose a boilerplate to initialize project.
        install    <plugin>       Install a plugin or a yeoman generator.
        dev                       Local development.
        build                     Build and package.
`, defaultMsgSuffix = `
    Options:
        --version, -[v]           Print version and exit successfully.
        --help, -[h]              Print this help and exit successfully.

    Report bugs to https://github.com/sjisntsuperman/create-fe-app/issues.
  `;
    let appendedMsg = '';
    const cmds = cmd.list();
    if (cmds && Object.keys(cmds).length > 0) {
        Object.keys(cmds).forEach((key) => {
            if (internalCmds.indexOf(key) === -1) {
                appendedMsg += `${beautify(key, 8, 31)}   ${cmds[key].desc}\n`;
            }
        });
    }
    const cli = meow_1.default(`${defaultMsgPrefix}${appendedMsg}${defaultMsgSuffix}`);
    return cli.showHelp(0);
}
;
function version(ctx) {
    const versions = process.versions;
    const keys = Object.keys(versions);
    let key = '';
    console.log('create-fe-app:', ctx.version);
    console.log('os:', os_1.default.type(), os_1.default.release(), os_1.default.platform(), os_1.default.arch());
    for (let i = 0, len = keys.length; i < len; i++) {
        key = keys[i];
        console.log('%s: %s', key, versions[key]);
    }
    return Promise.resolve();
}
;
function default_1(ctx) {
    const cmd = ctx.cmd;
    cmd.register('help', () => help(ctx));
    cmd.register('version', () => version(ctx));
}
exports.default = default_1;
;
