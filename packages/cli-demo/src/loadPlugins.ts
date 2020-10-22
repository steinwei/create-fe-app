import path from "path"
import fs from 'fs-extra'

export class LoadPlugins {
    ctx: CustomTS

    constructor(ctx: CustomTS) {
        this.ctx = ctx
    }

    loadModules(){
        const pluginDir = this.ctx.pluginDir
        return this.loadModulesList().then((names: string[])=>{
            const name = path.join(pluginDir, names[0])
            return this.ctx.LoadPlugins(name)
        })
    }

    // 确认模块存在
    loadModulesList(){
        const ctx = this.ctx
        const pkgPath = ctx.pkgPath

        return fs.readFile(pkgPath).then((info: any)=>{
            const json = JSON.parse(info) || {}
            const deps = json.devDependies || {}
            return Object.keys(deps)
        }).then((keys:string[])=>{
            return keys.filter((key:any)=>{
                // cli-demo-plugin
                return /^(cli\-demo)(\w)+$/.test(key)
            })
        })
    }
}

export default (ctx: CustomTS) => {
    const modules = new LoadPlugins(ctx)

    return Promise.resolve(modules)
}