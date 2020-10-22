import fs from 'fs';
import path from 'path';

class Config {
    /**
     * @function getPath
     * @desc     Find cli-demo.json file
     */
    static getPath(filename: string): string {
        let currDir: string = process.cwd();

        while (!fs.existsSync(path.join(currDir, filename))) {
            currDir = path.join(currDir, '../');

            // unix跟目录为/， win32系统根目录为 C:\\格式的
            if (currDir === '/' || /^[a-zA-Z]:\\$/.test(currDir)) {
                return '';
            }
        }

        return currDir;
    }

    /**
     * @function getBuildConfig
     * @desc     Find builder type in cli-demo.json
     */
    static getBuildConfig(){
        let builderOptions;

        if (Config.getPath('cli-demo.json')) {
            const jsonConfigFile = path.join(Config.getPath('cli-demo.json'), './cli-demo.json');
            const fileContent = fs.readFileSync(jsonConfigFile, 'utf-8');

            let cliDemoCfg;

            try {
                cliDemoCfg = JSON.parse(fileContent);
            } catch (ex) {
                console.error('请确保cli-demo.json配置是一个Object类型，并且含有builderOptions字段');
            }

            builderOptions = cliDemoCfg.builderOptions;

            if (!builderOptions) {
                console.error('请确保cli-demo.js配置包含builderOptions字段，且内容不为空');
                return {};
            }

            return builderOptions;
        } else if (Config.getPath('cli-demo.js')) {
            const jsConfigFile = path.join(Config.getPath('cli-demo.js'), './cli-demo.js');

            let cliDemoCfg = require(jsConfigFile);

            builderOptions = cliDemoCfg.builderOptions;

            if (!builderOptions) {
              console.error('请确保cli-demo.js配置包含builderOptions字段，且内容不为空');
                return {};
            }
            return builderOptions;
        } else {
            console.error('未找到 cli-demo 配置文件 cli-demo.json 或者 cli-demo.js');
            return {};
        }
    }
}

export default Config;