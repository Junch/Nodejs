import winston from 'winston';
winston.emitErrs = true;

// http://stackoverflow.com/questions/13157330/logging-with-winston-in-express-js-how-to-configure-for-different-environments
var logTransports = [];
if (process.env.NODE_ENV == 'production') {
    logTransports.push(new (winston.transports.File)({
        level: 'info',
        filename: './logs/all-logs.log',
        handleExceptions: true,
        json: true,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
        colorize: false
    }));
} else {
    logTransports.push(new (winston.transports.Console)({
        level: 'debug', // error
        handleExceptions: true,
        json: false,
        colorize: true
    }));
}

var logger = new winston.Logger({
    transports: logTransports,
    exitOnError: false
});

logger.stream =  {
    write: function (message, encoding) {
        logger.info(message);
    }
};

export default logger;
