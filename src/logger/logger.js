const winston = require('winston');
const { customLevelOptions } = require(`./customLevels.js`);

const devLogger = winston.createLogger({
    levels: customLevelOptions.levels,
    transports: [
        new winston.transports.Console({
            level: 'debug',
            format: winston.format.combine(
                winston.format.colorize({ colors: customLevelOptions.colors }),
                winston.format.simple()
            )
        })
    ]
})

const prodLogger = winston.createLogger({
    levels: customLevelOptions.levels,
    transports: [
        new winston.transports.Console({
            level: 'info',
            format: winston.format.combine(
                winston.format.colorize({ colors: customLevelOptions.colors }),
                winston.format.simple()
            )
        }),
        new winston.transports.File({
            level: 'error',
            filename: `${__dirname}/../../logs/errors.log`
        }),
    ]
})

const logger = process.env.ENV === 'prod' ? prodLogger : devLogger;

/**
 * @type {import('express').RequestHandler}
 */
const useLogger = (req, res, next) => {
    req.logger = logger;

    if (req.url !== '/favicon.ico') {
        // req.logger.http(`Request to: ${req.url}`);
    }

    next();
}


module.exports = {
    useLogger,
}