import fs from 'fs';
import path from 'path';

class Config {
    /**
     * @function getPath
     * @desc     Find fe-cli.json file
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
     * @desc     Find builder type in fe-cli.json
     */
    static getBuildConfig(){
        let builderOptions;

        if (Config.getPath('fe-cli.json')) {
            const jsonConfigFile = path.join(Config.getPath('fe-cli.json'), './fe-cli.json');
            const fileContent = fs.readFileSync(jsonConfigFile, 'utf-8');

            let cliDemoCfg;

            try {
                cliDemoCfg = JSON.parse(fileContent);
            } catch (ex) {
                console.error('请确保fe-cli.json配置是一个Object类型，并且含有builderOptions字段');
            }

            builderOptions = cliDemoCfg.builderOptions;

            if (!builderOptions) {
                console.error('请确保fe-cli.js配置包含builderOptions字段，且内容不为空');
                return {};
            }

            return builderOptions;
        } else if (Config.getPath('fe-cli.js')) {
            const jsConfigFile = path.join(Config.getPath('fe-cli.js'), './fe-cli.js');

            let cliDemoCfg = require(jsConfigFile);

            builderOptions = cliDemoCfg.builderOptions;

            if (!builderOptions) {
              console.error('请确保fe-cli.js配置包含builderOptions字段，且内容不为空');
                return {};
            }
            return builderOptions;
        } else {
            console.error('未找到 fe-cli 配置文件 fe-cli.json 或者 fe-cli.js');
            return {};
        }
    }
}

export default Config;