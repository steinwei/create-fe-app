const { homedir } = require('os')
const osenv = require('osenv')
const path = require('path')
const fs = require('fs-extra')

const baseDir = osenv.home()
const homeDir = path.join(baseDir, 'cli-demo')
const pluginDir = path.join(homeDir, 'node_modules')

function existDir() {
    return fs.existsSync(homeDir)
}

console.log(
    existDir()
)

module.exports = {
    baseDir: baseDir,
    homeDir: homedir,
    pluginDir: pluginDir
}

// console.log( pluginDir )