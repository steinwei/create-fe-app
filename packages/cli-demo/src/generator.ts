import path from "path";
import fs from 'fs-extra'
import yeoman from "yeoman-environment"
import inquirer from "inquirer";

const yeomanEnv = yeoman.createEnv()

export
	class Generator {
	ctx: CustomTS

	constructor(ctx: CustomTS) {
		this.ctx = ctx
	}

	init() {
		const self = this
		const ctx = this.ctx
		const logger = ctx.logger
		return this.loadGeneratorList().then((generators) => {
			const options = generators.map((item: CustomTS) => {
				return item.desc
			});
			if (generators.length) {
				inquirer.prompt([{
					type: 'list',
					name: 'desc',
					message: '您想要创建哪种类型的工程?',
					choices: options
				}]).then((answer) => {
					let name;

					generators.map((item: CustomTS) => {
						if (item.desc === answer.desc) {
							name = item.name;
						}
					});

					name && self.run(name);
				});
			} else {
				logger.info(
					'检测到你还未安装任何模板，请先安装后再进行项目初始化，'
				);
			}
		})
	}

	run(name: string) {
		const ctx = this.ctx
		const pluginDir = ctx.pluginDir
		let pathname = path.join(pluginDir, name, 'generators/app/index.js')
		yeomanEnv.register(pathname, name)
		yeomanEnv.run(name, ctx, () => { })
	}

	loadGeneratorList() {
		const ctx = this.ctx
		const baseDir = ctx.baseDir
		const pkg_dir = path.join(baseDir, 'package.json')
		const pluginDir = ctx.pluginDir

		return fs.readFile(pkg_dir).then((content: any) => {
			const json = JSON.parse(content);
			const deps = json.dependencies || json.devDependencies || {};

			return Object.keys(deps);
		}).then((names) => {
			const res = names.filter((name) => {
				if (!/generator-/.test(name)) return false;
	
				// generator-ivweb
				// @steinwei/generator-cli-demo
				// Make sure the generator exists
				const pathname = path.join(pluginDir, name);
				return fs.existsSync(pathname);
			}).map((name) => {
				const pathname = path.join(pluginDir, name);
				let packagePath = path.join(pathname, 'package.json');
	
				// Read generator config.
				let content:Buffer = fs.readFileSync(packagePath)
				const json = JSON.parse(content.toString());
				const desc = json.description;
				
				return { name, desc };
			})
			return res
		}
		)
	}
}

export default (ctx: CustomTS) => {
	const cmd = ctx.cmd
	cmd.register("init", () => new Generator(ctx).init())
}