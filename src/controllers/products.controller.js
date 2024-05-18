class ProductsController {
    constructor(service) {
        this.service = service
    }

    #handleError(res, e) {
        if (e.message === 'invalid parameters') return res.status(400).json('Invalid parameters')
        if (e.message === 'not found') return res.status(404).json('Not found')
        return res.status(500).json({ error: e });
    }

    async getAll(req, res) {
        const filters = req.query;
        const products = await this.service.getAll(filters);
        return res.json(products);
    }

    async getById(req, res) {
        const id = req.params.id;
        try {
            const product = await this.service.getById(id);
            if (!product) return res.json(404).json({ error: 'Not found' });

            return res.json(product);
        } catch (e) {
            return this.#handleError(res, e);
        }
    }

    async createOne(req, res) {
        const product = req.body
        try {
            const newProduct = await this.service.createOne(product);
            res.json(newProduct);
        } catch (e) {
            return this.#handleError(res, e);
        }
    }

    async deleteById(req, res) {
        const id = req.params.id;
        try {
            const productDelete = await this.service.deleteById(id);
            res.json({ status: 'success', payload: productDelete });
        } catch (e) {
            return this.#handleError(res, e);
        }
    }
}

module.exports = { ProductsController };