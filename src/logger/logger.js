const winston = require("winston");
const { levels, colors } = require('./levels');
const environment = process.env.ENV;

const devLogger = winston.createLogger({
    levels,
    transports: [
        new winston.transports.Console({
            level: 'debug',
            format: winston.format.combine(
                winston.format.colorize(colors),
                winston.format.simple()
            )
        })
    ]
});

const prodLogger = winston.createLogger({
    level,
    transports: [
        new winston.transports.Console({
            level: 'info',
            format: winston.format.combine(
                winston.format.colorize(colors),
                winston.format.simple()
            )
        }),

        new winston.transports.File({
            level: 'error',
            filename: '../../logs'
        })
    ]
});

const logger = environment === 'production' ? prodLogger : devLogger;

/**
 * @type { import('express').RequestHandler }
 */
const useLogger = (req, _, next) => {
    req.logger = logger;
    next();
}

module.exports = { useLogger };