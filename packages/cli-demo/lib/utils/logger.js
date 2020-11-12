"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLogger = exports.logger = void 0;
// import chalk from "chalk";
const winston_1 = __importDefault(require("winston"));
class logger {
    constructor(ctx) {
        this.ctx = ctx;
        const options = {
            file: {
                level: 'info',
                filename: `${ctx.homeDir}/logs/app.log`,
                handleExceptions: true,
                json: true,
                maxsize: 5242880,
                maxFiles: 5,
                colorize: false,
            },
            console: {
                level: 'debug',
                handleExceptions: true,
                json: false,
                colorize: true,
            },
        };
        // instantiate a new Winston Logger with the settings defined above
        this.logger = winston_1.default.createLogger({
            transports: [
                new winston_1.default.transports.File(options.file),
                new winston_1.default.transports.Console(options.console)
            ],
            exitOnError: false,
        });
    }
    info(msg) {
        // chalk.cyan(msg)
        return this.logger.info(msg);
    }
    debug(msg) {
        return this.logger.debug(msg);
    }
    warn(msg) {
        // chalk.red(msg)
        return this.logger.info(msg);
    }
}
exports.logger = logger;
exports.createLogger = (ctx) => {
    return new logger(ctx);
};
