import path from "path"
import fs from 'fs-extra'
import spawn from "cross-spawn"
import { Config } from './config'

export
class Builder{

  ctx: CustomTS

  constructor(ctx: CustomTS){
    this.ctx = ctx
  }

  execNpmCommand(cmd:string, modules: string, where: pathName, registry?: boolean){
    let args: string[] = []
    args.concat(cmd).concat(modules)
    if(!registry) {
        args.concat('--registry https://r.npm.taobao.org')
    }
    args.concat('--global-style').concat('--unsafe-perm')
    // 流存储log
    const npm = spawn("npm", args, {cwd: where})

    let output = ''
    npm.stdout.on("data", (data: string) => {
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

  runBuild(cmd: string) {
    const self = this;
    const { log, pluginDir, baseDir, logger } = this.ctx;
    return Config.getBuilderType().then((type: string) => {
      logger.debug(type)
      const pathname = path.join(pluginDir, type);

      if (!fs.existsSync(pathname)) {
        log.info(`检测到您本地没有安装${type}构建器, 即将为您安装...`);
        // const loading = new Loading(`正在安装${type}，请稍等`);
        return this.execNpmCommand('install', type, baseDir).then(function (result) {
          if (!result.code) {
            // loading.success();
            log.info(`${type} 构建器安装完成, 即将执行构建命令...`);
            console.log('path', path);
            require(pathname)(cmd, self.ctx);
          }
        });
      } else {
        // console.log('path', path);
        // return this.checkUpdate().then(() => {
            require(pathname)(cmd, self.ctx);
        // });
      }
    });
  }

  checkUpdate() {

  }

  async loadBuilderList(){
		const ctx = this.ctx
		const baseDir = ctx.baseDir
		const pkg_dir = path.join(baseDir, 'package.json')
		const pluginDir = ctx.pluginDir

		const deps_arr: Promise<string[]> = fs.readFile(pkg_dir).then((content: any)=>{
			const json = JSON.parse(content);
        	const deps = json.dependencies || json.devDependencies || {};

	        return Object.keys(deps);
		});
		const res = (await deps_arr).filter(function (name) {
			// Find yeoman generator.
			// generator-ivweb
			if (!/^buidler-|^@[^/]+\/buidler-/.test(name)) return false;
	  
			// Make sure the generator exists
			const pathname = path.join(pluginDir, name);
			return fs.existsSync(pathname);
		  }).map(function (name) {
			const pathname = path.join(pluginDir, name);
			let packagePath = path.join(pathname, 'package.json');
	  
			// Read generator config.
			return fs.readFile(packagePath).then(function (content: any) {
			  const json = JSON.parse(content);
			  const desc = json.description;
	  
			  return {name, desc};
			});
		})
		return res
	}
}

export default (ctx: CustomTS) => {
  const cmd = ctx.cmd;

  cmd.register("dev", () => new Builder(ctx).runBuild("dev"));

  return cmd.register("build", () => new Builder(ctx).runBuild("build"));
}