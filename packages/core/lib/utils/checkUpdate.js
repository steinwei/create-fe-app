"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const request_promise_1 = __importDefault(require("request-promise"));
function checkUpdates(name, version, registry) {
    return new Promise(function (resolve, reject) {
        const options = {
            url: `${registry}/${name}/${version}`,
            method: 'GET'
        };
        request_promise_1.default(options)
            .then(function (response) {
            response = JSON.parse(response);
            resolve(response);
        })
            .catch((err) => {
            resolve({ err: err && err.message });
        });
    });
}
exports.default = checkUpdates;
