const Router = require(`./router.js`);
const { PUBLIC } = require(`${__dirname}/../config/policies.constants.js`);
const { getURL } = require(`../utils/utils.js`);

const testString = 'Error de prueba';

class LoggerRouter extends Router {
    init() {
        this.get('/', [PUBLIC], (req, res) => {
            const links = {
                fatal: `${getURL(req)}/loggertest/fatal`,
                error: `${getURL(req)}/loggertest/error`,
                warning: `${getURL(req)}/loggertest/warning`,
                info: `${getURL(req)}/loggertest/info`,
                http: `${getURL(req)}/loggertest/http`,
                debug: `${getURL(req)}/loggertest/debug`,
                all: `${getURL(req)}/loggertest/all`,
            }
            res.json(links)
        });

        this.get('/fatal', [PUBLIC], (req, res) => {
            req.logger.fatal(testString)
            res.json({
                test: 'fatal',
                environment: process.env.ENV,
                back: `${getURL(req)}/loggertest`
            })
        });

        this.get('/error', [PUBLIC], (req, res) => {
            req.logger.error(testString)
            res.json({
                test: 'error',
                environment: process.env.ENV,
                back: `${getURL(req)}/loggertest`
            })
        });

        this.get('/warning', [PUBLIC], (req, res) => {
            req.logger.warning(testString)
            res.json({
                test: 'warning',
                environment: process.env.ENV,
                back: `${getURL(req)}/loggertest`
            })
        });

        this.get('/info', [PUBLIC], (req, res) => {
            req.logger.info(testString)
            res.json({
                test: 'info',
                environment: process.env.ENV,
                back: `${getURL(req)}/loggertest`
            })
        });

        this.get('/http', [PUBLIC], (req, res) => {
            req.logger.http(testString)
            res.json({
                test: 'http',
                environment: process.env.ENV,
                back: `${getURL(req)}/loggertest`
            })
        });

        this.get('/debug', [PUBLIC], (req, res) => {
            req.logger.debug(testString)
            res.json({
                test: 'debug',
                environment: process.env.ENV,
                back: `${getURL(req)}/loggertest`
            })
        });

        this.get('/all', [PUBLIC], (req, res) => {
            req.logger.debug('All: \n')

            req.logger.fatal(testString);
            req.logger.error(testString);
            req.logger.warning(testString);
            req.logger.info(testString);
            req.logger.http(testString);
            req.logger.debug(testString);

            res.json({
                test: 'all',
                environment: process.env.ENV,
                back: `${getURL(req)}/loggertest`
            })
        });
    }
}

module.exports = {
    configure: (app) => app.use('/loggerTest', new LoggerRouter().getRouter())
}