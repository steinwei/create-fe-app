"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const js_yaml_1 = __importDefault(require("js-yaml"));
const fs_extra_1 = __importDefault(require("fs-extra"));
// Get document, or throw exception on error
function parseYaml(path) {
    let config;
    if (fs_extra_1.default.existsSync(path)) {
        try {
            config = js_yaml_1.default.safeLoad(fs_extra_1.default.readFileSync(path).toString());
        }
        catch (e) {
            console.log(e);
        }
    }
    return config;
}
// function safeDump(obj, path) {
//   let doc;
//   try {
//     doc = yaml.safeDump(obj, {
//       'styles': {
//         '!!null': 'canonical' // dump null as ~
//       },
//       'sortKeys': true        // sort object keys
//     });
//   } catch (e) {
//     console.log(e);
//   }
//   return fs.writeFileSync(path, doc, 'utf-8');
// }
exports.default = parseYaml;
// exports.safeDump = safeDump;
