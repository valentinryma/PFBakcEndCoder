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

class UsersRouter extends Router {
    init() {
        this.get(
            '/',
            [PUBLIC /* ADMIN */],
            withController((controller, req, res) => controller.getAll(req, res))
        );

        this.delete(
            '/',
            [PUBLIC /* ADMIN */],
            withController((controller, req, res) => controller.deleteAllInactives(req, res))
        );


        this.patch(
            '/premium/set/:uid',
            [USER],
            withController((controller, req, res) => controller.setPremium(req, res))
        );

        this.patch(
            '/premium/remove/:uid',
            [PREMIUM],
            withController((controller, req, res) => controller.removePremium(req, res))
        );

    }
}

module.exports = {
    configure: (app) => app.use('/api/users/', new UsersRouter().getRouter())
}