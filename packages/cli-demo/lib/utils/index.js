"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVersion = void 0;
const pkg = require('../../');
function getVersion() {
    return pkg.version;
}
exports.getVersion = getVersion;
