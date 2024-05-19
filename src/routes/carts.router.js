const Router = require(`${__dirname}/router.js`);
const { PUBLIC } = require(`${__dirname}/../config/policies.constants.js`);
const { CartsService } = require(`${__dirname}/../services/carts.service.js`);
const { CartsController } = require(`${__dirname}/../controllers/carts.controller.js`);

const withController = (callback) => {
    return (req, res) => {
        const storage = req.app.get('cart.storage');
        const service = new CartsService(storage);
        const controller = new CartsController(service);
        return callback(controller, req, res);
    }
}

class CartRouter extends Router {
    init() {
        // Get
        this.get('/', [PUBLIC], withController((controller, req, res) => controller.getAll(req, res)))
        this.get('/:id', [PUBLIC], withController((controller, req, res) => controller.getById(req, res)))

        // Post
        this.post('/', [PUBLIC], withController((controller, req, res) => controller.createOne(req, res)))
        this.post('/:cid/product/:pid', [PUBLIC], withController((controller, req, res) => controller.addProductInCart(req, res)))

        // Delete
        this.delete('/:id', [PUBLIC], withController((controller, req, res) => controller.deleteById(req, res)))
        this.delete('/:cid/product/:pid', [PUBLIC], withController((controller, req, res) => controller.deleteProductInCart(req, res)))

        // Put
        this.put('/:id/', [PUBLIC], withController((controller, req, res) => controller.updateCartProductArray(req, res)))
        this.put('/:cid/product/:pid', [PUBLIC], withController((controller, req, res) => controller.updateCartProductQuantity(req, res)))
    }
}

module.exports = {
    configure: (app) => app.use('/api/carts', new CartRouter().getRouter())
}


