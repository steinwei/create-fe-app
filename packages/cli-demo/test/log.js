const winston = require('winston');

// Logger configuration
const logConfiguration = {
    'transports': [
        new winston.transports.Console()
    ]
};

// Create the logger
const logger = winston.createLogger(logConfiguration);

// Log a message
logger.log({
    message: 'Hello, Winston!',
    level: 'info'
});
// Log a message
logger.info('Hello, Winston!', 'test2');