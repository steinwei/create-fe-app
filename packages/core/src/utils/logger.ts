// import chalk from "chalk";
import winston from 'winston'

export class logger{

    ctx: CustomTS;
    logger: any;

    constructor(ctx: CustomTS){
        this.ctx = ctx
        const options = {
            file: {
              level: 'info',
              filename: `${ctx.homeDir}/logs/app.log`,
              handleExceptions: true,
              json: true,
              maxsize: 5242880, // 5MB
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
        this.logger = winston.createLogger({
            transports: [
            new winston.transports.File(options.file),
            new winston.transports.Console(options.console)
            ],
            exitOnError: false, // do not exit on handled exceptions
            // stream: {
            //     write: function(message) {
            //       // use the 'info' log level so the output will be picked up by both transports (file and console)
            //       logger.info(message);
            //     },
            //   }
        });

    }

    info(msg: string){
        // chalk.cyan(msg)
        return this.logger.info(msg)
    }

    debug(msg: string){
        return this.logger.debug(msg)
    }

    warn(msg:string){
        // chalk.red(msg)
        return this.logger.info(msg)
    }
}

export const createLogger = (ctx: CustomTS) => {
    return new logger(ctx)
}