import yaml from 'js-yaml';
import fs from 'fs-extra';

// Get document, or throw exception on error
function parseYaml(path: pathName) {
  let config;

  if (fs.existsSync(path)) {
    try {
      config = yaml.safeLoad(fs.readFileSync(path).toString());

    } catch (e) {
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

export default parseYaml;
// exports.safeDump = safeDump;
