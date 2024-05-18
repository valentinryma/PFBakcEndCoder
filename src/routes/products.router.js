const Router = require(`${__dirname}/router.js`);
const { PUBLIC } = require(`${__dirname}/../config/policies.constants.js`);

const { ProductsService } = require(`${__dirname}/../services/products.service.js`);
const { ProductsController } = require(`${__dirname}/../controllers/products.controller`)

const withController = (callback) => {
    return (req, res) => {
        // Storage
        const storage = req.app.get('product.storage');

        // Service con acceso al Storage
        const service = new ProductsService(storage);

        // Controller con acceso al Servicio
        const controller = new ProductsController(service);

        return callback(controller, req, res);
    }
}

class ProductsRouter extends Router {
    init() {
        this.get('/', [PUBLIC], withController((controller, req, res) => controller.getAll(req, res)));

        this.get('/:id', [PUBLIC], withController((controller, req, res) => controller.getById(req, res)));

        this.post('/', [PUBLIC], withController((controller, req, res) => controller.createOne(req, res)));

        this.delete('/:id', [PUBLIC], withController((controller, req, res) => controller.deleteById(req, res)));
    }
}
module.exports = {
    configure: (app) => app.use('/api/products', new ProductsRouter().getRouter())
};