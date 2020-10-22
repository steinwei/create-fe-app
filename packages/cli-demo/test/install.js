const baseDir = require('./home').baseDir

function execNpmCmd(cmd, where, registry){
    let args = []
    args.concat([cmd])
    if(!registry) {
        args.concat(['--registry https://r.npm.taobao.org'])
    }
    let output = ''
    const npm = spawn("npm", args, {cwd: where})
    npm.stdout.on("data", (data) => {
        output += data
    })
    npm.on("close", ()=>{
        this.ctx.logger.info('installed successfully')
    })
    return Promise.resolve({
        code: 0,
        data: output
    })
}

execNpmCmd("install", baseDir, false)