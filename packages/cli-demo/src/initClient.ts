import fs from "fs-extra";
import path from "path";

export
class initClient{
    ctx: CustomTS
    constructor(ctx: CustomTS){
        this.ctx = ctx
    }

    // todo: init .log files
    initLogs(){
        const ctx = this.ctx
        const homeDir = ctx.homeDir
        const logDir = path.join(homeDir, 'logs')
        const exist = fs.existsSync(logDir)
        let promise = Promise.resolve()
        if(!exist){
            promise = fs.mkdir(logDir)
        }
        return promise
    }

    initRc(){
        const ctx = this.ctx
        const homeDir = ctx.homeDir
        const rcPath = path.join(homeDir, '.cli-demo.yml')
        const exist = fs.existsSync(rcPath)
        let promise = Promise.resolve()
        if(!exist){
            promise = fs.writeFile(rcPath, JSON.stringify({
                "registry": "https://r.npm.taobao.org",
                "proxy": ""
              }, null, 4));
        }
        return promise
    }

    initHome(){
        const ctx = this.ctx
        const homeDir = ctx.homeDir
        const exist = fs.existsSync(homeDir)
        let promise = Promise.resolve()
        if(!exist){
            promise = fs.mkdir(homeDir)
        }
        return promise
    }

    initPkg(){
        const ctx = this.ctx
        const pkgPath = path.join(ctx.homeDir, 'package.json')
        let promise = Promise.resolve()
        if(!fs.existsSync(pkgPath)){
             promise = fs.writeFile(pkgPath, JSON.stringify({
                "name": "cli-demo-home",
                "version": "0.0.0",
                "private": true
              }, null, 4));
        }
        return promise
    }
}

export default (ctx: CustomTS) => {
    const client = new initClient(ctx)

    return Promise.all([
        client.initHome(),
        client.initLogs(),
        client.initRc(),
        client.initPkg(),
    ])
}