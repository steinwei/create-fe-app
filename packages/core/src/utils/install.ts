import spawn from "cross-spawn";

export default (ctx: CustomTS)=>{
    const cmd = ctx.cmd
    const baseDir = ctx.baseDir
    cmd.register("install", (args: CustomTS)=>new Install(ctx).execNpmCmd("install", args['_'][0], baseDir))
    return Promise.resolve()
}

export
class Install{
    ctx: CustomTS

    constructor(ctx:CustomTS){
        this.ctx = ctx
    }

    checkUpdate(plugins: CustomTS) {
        return new Promise((resolve, reject)=> {
            
        })
    }

    execNpmCmd(cmd:string, modules: string, where: pathName){
        const ctx = this.ctx
        const {
            registry = '',
            proxy = ''
        } = ctx.config
        return new Promise((resolve, reject)=>{
            let args: string[] = [cmd].concat(modules)
            if(registry) {
                args = args.concat('--registry=${registry}')
            } else {
                args = args.concat('--registry=https://r.npm.taobao.org')
            }
            if(proxy) {
                args = args.concat(`--proxy=${proxy}`)
            }
            args = args.concat('--global-style').concat('--unsafe-perm')

            ctx.logger.debug(args);
            // 流存储log
            const npm = spawn('npm', args, {cwd: where});
    
            let output = '';
            npm.stdout.on('data', (data) => {
                output += data;
            }).pipe(process.stdout);
    
            npm.stderr.on('data', (data) => {
                output += data;
            }).pipe(process.stderr);
    
            npm.on('close', (code) => {
                if (!code) {
                    resolve({code: 0, data: output});
                } else {
                    reject({code: code, data: output});
                }
            });
        })
    }
}