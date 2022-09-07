# `create-fe-app`

## 前言

自制脚手架，参考ivweb团队的脚手架制作并完成。仅作为学习使用。

- cli-core (ok)
- builder-webpack (ok)
- generator-template (ok)

## 流程

这里制作分为三个模块进行。

一个是核心模块 create-fe-app。

builder-webpack 为本地构建器。

generator 为 模板生成器。

create-fe-app 里包含有 command，builder，generator几大主要功能模块。

### 暂未实现功能

- checkUpdate 检测脚手架更新 以及 检测插件的更新
- 根据互动，自动下载插件或模板到本地
- build，没打通CI/CD，仅仅是单纯的webpack工具的打包，需要自己另外接入CICD流程中

### 已实现功能

- install，安装插件到本地
- init， 生成指定模板
- dev， 本地构建前端应用
- build， 本地打包

### command

command 的主要作用是来调度任务。脚手架初始化阶段，command 内部建立一个对象存储每个任务。

当用户向脚手架传递任务作为参数的时候，command 会搜索到对应的任务，并执行。

比如这里，我们使用

- `init` 作为调度generator 的一个指令
- `install` 作为安装插件指令
- `dev` 作为本地构建指令
- `build` 作为打包指令

它的代码实现非常简单。仅有几行代码。

### builder

builder 的主要作用是把上下文传递给 builder-webpack进行本地构建。

builder　仅仅做的事情只是把获取 builder-webpack的入口，

然后把 上下文传递给它。

上下文包括下什么呢？这里稍微列举一些它的属性。

```typescript
class cli{
    logger: any;
    pluginDir: pathName;
    homeDir: pathName;
    pkgPath: pathName;
    workDir: pathName;
    args: any;
}
```

传递之后，builder-webpack会根据 workDir 在工作文件夹 利用webpack 进行本地构建或者打包。

这里的webpack 配置是经过优化过的。 默认是多页面MPA的配置。

用到了一些比较流行的优化配置。这里列举一部分。

- mini-css-extract-plugin CSS压缩插件
- happypack 多线程构建工具

### generator

generator 的主要作用是把上下文传递给 generator， generator 利用 yeoman工具生成本地文件模板。

### 解释下为何要另外分插件来安装

这里考虑过参考 create-react-app 的方案，在用inquirer做选择时，

根据answer来决定捆绑哪个插件下载到本地，这样就无须另外手动去安装插件。

目前没有实现这个功能。

分插件安装，是因为可能有很多不同的场景需要定制。

因此插件是根据场景定制的，并且这边定制的话其实也不难，只是把文件拷贝一下就可以了。

如果有特殊逻辑的话，可以修改 `~/.create-fe-app/node_modules/${插件名}/generators/app/index.js`。

### 如何实现定制化

也就是自己可以自定义写入 react模板或者是 vue 模板，用同一套的webpack构建。

另外模板文件里面要包含，yeoman-generator。

脚手架就是通过yeoman来生成模板的，因此模板中会需要到它。

生成后的模板不会与yeoman有联系。

## 声明

此项目借鉴于腾讯ivweb团队的外部开源脚手架，侵权即删。
