const Router = require('./router');

// TODO: Politicas de Rol { PUBLIC, ADMIN, USER, PREMIUM }

const { FactoryDAO } = require('../factories/factoryDao.factory.js');

const { CartsController } = require('../controllers/carts.controller.js');

const { CartsRepository } = require('../services/carts.repository.js');

/**
 * Función de orden superior que crea e inicializa un controlador y luego invoca la función de callback proporcionada.
 *
 * @param {function} callback - La función de callback que se ejecutará con el controlador inicializado, el objeto de solicitud y el objeto de respuesta.
 * @returns {function} - Una función que toma los objetos de solicitud y respuesta de Express, inicializa el DAO, el servicio y el controlador, y luego llama al callback con ellos.
 */
const withController = (callback) => {
    return (req, res) => {
        const dao = new FactoryDAO().getCartDao();

        const service = new CartsRepository(dao);

        const controller = new CartsController(service);

        return callback(controller, req, res);
    };
};

class CartsRouter extends Router {
    init() {
        // GET

        this.get('/', withController((controller, req, res) => controller.getAll(req, res)));

        this.get('/:cid', withController((controller, req, res) => controller.getById(req, res)));

        // POST        

        this.post('/', withController((controller, req, res) => controller.create(req, res)));

        this.post('/:cid/product/:pid', withController((controller, req, res) => controller.addProduct(req, res)));

        // TODO: ESTA RUTA
        // this.post('/:cid/purcharse', withController((controller, req, res) => controller.purschase(req, res)))

        // DELTE

        this.delete('/:cid', withController((controller, req, res) => controller.deleteById(req, res)))

        this.delete('/:cid/product/:pid', withController((controller, req, res) => controller.removeProduct(req, res)))

        // PUT

        // this.put('/:cid', withController((controller, req, res) => controller.updateCart(req, res)))

        // this.put('/:cid/product/:pid', withController((controller, req, res) => controller.updateProduct(req, res)))

    };
};

module.exports = {
    configure: (app) => app.use('/api/carts', new CartsRouter().getRouter())
};