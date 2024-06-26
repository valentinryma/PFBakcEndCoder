// Service: repository.
class ProductsController {
    constructor(service) {
        this.service = service;
    }

    async getAll(req, res) {
        const filters = req.query;
        const products = await this.service.getAll(filters);

        return res.json(products);
    }

    async getById(req, res) {
        const id = req.params.id;
        const product = await this.service.getById(id);

        return res.json(product);
    }

    async createOne(req, res) {
        const product = req.body
        const newProduct = await this.service.createOne(product);

        return res.json(newProduct);
    }

    async deleteById(req, res) {
        const id = req.params.id;
        const uid = req.user._id;

        const productDelete = await this.service.deleteById(id, uid);

        return res.json({ status: 'success', payload: productDelete });

    }
}

module.exports = { ProductsController };