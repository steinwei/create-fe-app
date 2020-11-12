import meow from 'meow';
import os from 'os'

/**
 * beatify string
 * @param str
 * @param before length of space before str
 * @param total total length
 */
function beautify(str: string, before = 0, total: number) {
    const spaceLength = Math.max(0, total - before - str.length);
    return `${' '.repeat(before)}${str}${' '.repeat(spaceLength)}`;
}

function help(ctx: CustomTS) {
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
    Usage: cli-demo [options] [command]

    Commands:
        init                      Choose a boilerplate to initialize project.
        install    <plugin>       Install a plugin or a yeoman generator.
        dev                       Local development.
        build                     Build and package.
`,
        defaultMsgSuffix = `
    Options:
        --version, -[v]           Print version and exit successfully.
        --help, -[h]              Print this help and exit successfully.

    Report bugs to https://github.com/sjisntsuperman/cli-demo/issues.
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

    const cli = meow(`${defaultMsgPrefix}${appendedMsg}${defaultMsgSuffix}`);

    return cli.showHelp(0);
};

function version(ctx: CustomTS) {
    const versions = process.versions;
    const keys = Object.keys(versions);
    let key = '';

    console.log('cli-demo:', ctx.version);
    console.log('os:', os.type(), os.release(), os.platform(), os.arch());

    for (let i = 0, len = keys.length; i < len; i++) {
        key = keys[i];
        console.log('%s: %s', key, versions[key]);
    }

    return Promise.resolve();
};

export default function (ctx: CustomTS) {

    const cmd = ctx.cmd;

    cmd.register('help', () => help(ctx));

    cmd.register('version', () => version(ctx));
};
