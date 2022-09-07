"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Command = void 0;
const events_1 = require("events");
class Command extends events_1.EventEmitter {
    constructor() {
        super();
        this.alias = {};
        this.store = {};
    }
    get(name) {
        return this.alias[name];
    }
    list() { }
    register(name, value) {
        return this.alias[name] = value;
    }
}
exports.Command = Command;
