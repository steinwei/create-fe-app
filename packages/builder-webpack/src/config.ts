import fs from 'fs';
import path from 'path';

class Config {
    /**
     * @function getPath
     * @desc     Find create-fe-app.json file
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
     * @desc     Find builder type in create-fe-app.json
     */
    static getBuildConfig(){
        let builderOptions;

        if (Config.getPath('create-fe-app.json')) {
            const jsonConfigFile = path.join(Config.getPath('create-fe-app.json'), './create-fe-app.json');
            const fileContent = fs.readFileSync(jsonConfigFile, 'utf-8');

            let cliCfg;

            try {
                cliCfg = JSON.parse(fileContent);
            } catch (ex) {
                console.error('请确保create-fe-app.json配置是一个Object类型，并且含有builderOptions字段');
            }

            builderOptions = cliCfg.builderOptions;

            if (!builderOptions) {
                console.error('请确保create-fe-app.js配置包含builderOptions字段，且内容不为空');
                return {};
            }

            return builderOptions;
        } else if (Config.getPath('create-fe-app.js')) {
            const jsConfigFile = path.join(Config.getPath('create-fe-app.js'), './create-fe-app.js');

            let cliCfg = require(jsConfigFile);

            builderOptions = cliCfg.builderOptions;

            if (!builderOptions) {
              console.error('请确保create-fe-app.js配置包含builderOptions字段，且内容不为空');
                return {};
            }
            return builderOptions;
        } else {
            console.error('未找到 create-fe-app 配置文件 create-fe-app.json 或者 create-fe-app.js');
            return {};
        }
    }
}

export default Config;