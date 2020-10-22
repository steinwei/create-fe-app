import fs from "fs-extra";
import path, { resolve } from "path";
import process from 'process';

export
class Config {

    static async getLocal() {
        const workDir = process.cwd()
        const configPath = path.join(workDir, 'cli-demo.json')
        const config = await fs.readFileSync(configPath)
        const json = JSON.parse(config.toString())

        console.log(json)

        return new Promise(resolve=>{
            resolve(json)
        })
    }

    static getBuilderType() {
        return Config.getLocal().then((json: CustomTS)=>{
            const builderType = json.builderType
            return builderType
        })
    }

}