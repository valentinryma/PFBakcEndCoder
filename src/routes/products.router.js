const Router = require('./router');

// TODO: Politicas de Rol { PUBLIC, ADMIN, USER, PREMIUM }

const { FactoryDAO } = require('../factories/factoryDao.factory.js');

const { ProductsRepository } = require('../services/products.repository.js');

const { ProductsController } = require('../controllers/products.controller.js');

/**
 * Función de orden superior que crea e inicializa un controlador y luego invoca la función de callback proporcionada.
 *
 * @param {function} callback - La función de callback que se ejecutará con el controlador inicializado, el objeto de solicitud y el objeto de respuesta.
 * @returns {function} - Una función que toma los objetos de solicitud y respuesta de Express, inicializa el DAO, el servicio y el controlador, y luego llama al callback con ellos.
 */
const withController = (callback) => {
    return (req, res) => {
        const dao = new FactoryDAO().getProductDao();

        const service = new ProductsRepository(dao);

        const controller = new ProductsController(service);

        return callback(controller, req, res);
    };
};

class ProductsRouter extends Router {
    init() {
        this.get('/', withController((controller, req, res) => controller.getAll(req, res)));

        this.get('/:pid', withController((controller, req, res) => controller.getById(req, res)));

        this.post('/', withController((controller, req, res) => controller.create(req, res)));

        this.delete('/:pid', withController((controller, req, res) => controller.deleteById(req, res)));
    };
};

module.exports = {
    configure: (app) => app.use('/api/products', new ProductsRouter().getRouter())
};