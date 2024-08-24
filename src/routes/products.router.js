const Router = require(`${__dirname}/router.js`);

const { PUBLIC, ADMIN, USER, PREMIUM } = require(`${__dirname}/../config/policies.constants.js`);

const { FactoryDAO } = require(`${__dirname}/../dao/factory.js`);

const { ProductsRepository } = require(`${__dirname}/../services/products/products.repository.js`);

const { ProductsController } = require(`${__dirname}/../controllers/products.controller`)

const withController = (callback) => {
    return (req, res) => {
        // Storage
        const dao = new FactoryDAO().getProductDao();

        // Repository con acceso al Storage
        const service = new ProductsRepository(dao);

        // Controller con acceso al Servicio
        const controller = new ProductsController(service);

        return callback(controller, req, res);
    }
}

class ProductsRouter extends Router {
    init() {
        this.get('/', [PUBLIC], withController((controller, req, res) => controller.getAll(req, res)));

        this.get('/:id', [USER], withController((controller, req, res) => controller.getById(req, res)));

        this.post('/', [PUBLIC /*ADMIN*/], withController((controller, req, res) => controller.createOne(req, res)));

        this.delete('/:id', [ADMIN, PREMIUM], withController((controller, req, res) => controller.deleteById(req, res)));
    }
}
module.exports = {
    configure: (app) => app.use('/api/products', new ProductsRouter().getRouter())
};