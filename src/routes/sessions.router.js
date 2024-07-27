const passport = require('passport');

const Router = require('./router.js');
const { UserDTO } = require('../dtos/users.dto.js');

const { FactoryDAO } = require('../factories/factoryDao.factory.js');

const { UsersRepository } = require('../services/users.repository.js');

const { UsersController } = require('../controllers/apiControllers/users.controller.js');

const { USER, PUBLIC, ADMIN, PREMIUM } = require('./policies.constants.js');
/**
 * Función de orden superior que crea e inicializa un controlador y luego invoca la función de callback proporcionada.
 *
 * @param {function} callback - La función de callback que se ejecutará con el controlador inicializado, el objeto de solicitud y el objeto de respuesta.
 * @returns {function} - Una función que toma los objetos de solicitud y respuesta de Express, inicializa el DAO, el servicio y el controlador, y luego llama al callback con ellos.
 */
const withController = (callback) => {
    return (req, res) => {
        const dao = new FactoryDAO().getUserDao();

        const service = new UsersRepository(dao, UserDTO);

        const controller = new UsersController(service);

        return callback(controller, req, res);
    };
};

class SessionsRouter extends Router {
    init() {
        this.get(
            '/current',
            [USER, PREMIUM, ADMIN],
            passport.authenticate('current', { session: false }),
            withController(
                (controller, req, res) => {
                    controller.getCurrent(req, res);
                }
            )
        );

        this.post(
            '/register',
            [PUBLIC],
            passport.authenticate('register', { fialureRedirect: '/api/sessions/failregister' }),
            async (_, res) => {
                return res.sendSuccessJSON({ redirect: '/' });
            }
        );

        this.get(
            '/failregister',
            [PUBLIC],
            (_, res) => {
                return res.status(400).json({ status: "error" });
            }
        );

        this.post(
            '/login',
            [PUBLIC],
            passport.authenticate('login', { failureRedirect: '/api/sessions/faillogin' }),
            withController(
                (controller, req, res) => {
                    controller.login(req, res);
                }
            )
        );

        this.get(
            '/faillogin',
            [PUBLIC],
            (_, res) => {
                return res.status(400).json({ status: "error" });
            }
        );

        this.post(
            '/logout',
            [PUBLIC],
            withController(
                (controller, req, res) => {
                    controller.logout(req, res);
                }
            )
        );
    }
}

module.exports = {
    configure: (app) => app.use('/api/sessions', new SessionsRouter().getRouter())
}