class CartsController {
    constructor(service) {
        this.service = service;
    }

    #handleError(res, e) {
        if (e.message === 'invalid parameters') return res.status(400).json({ status: "error", error: 'Invalid parameters' })
        if (e.message === 'not found') return res.status(404).json({ status: "error", error: 'Not found' })
        return res.status(500).json({ error: e });
    }

    async getAll(_, res) {
        const carts = await this.service.getAll();
        console.log('a')
        return res.json(carts);
    }

    async getById(req, res) {
        const id = req.params.id;

        try {
            const cart = await this.service.getById(id);
            if (!cart) return res.status(404).json('Not found');
            return cart

        } catch (e) {
            return this.#handleError(res, e);
        }
    }

    async createOne(_, res) {
        try {
            const emptyCart = await this.service.createOne();
            res.json(emptyCart);
        } catch (e) {
            return this.#handleError(res, e);
        }
    }

    async deleteById(req, res) {
        const id = req.params.id;
        try {
            const cartDelete = await this.service.deleteById(id);
            res.json({ status: 'success', cartDelete });
        } catch (e) {
            return this.#handleError(res, e);
        }
    }

    async addProductInCart(req, res) {
        const cid = req.params.cid;
        const product = {
            pid: req.params.pid,
            quantity: req.body.quantity
        };

        try {
            const cartUpdate = await this.service.addProductInCart(cid, product);
            res.json({ status: 'success', cartUpdate })
        } catch (e) {
            return this.#handleError(res, e);
        }
    }

    async updateCartProductArray(req, res) {
        const cid = req.params.id;
        const productArray = req.body

        try {
            const cartUpdate = await this.service.updateCartProductArray(cid, productArray);
            return res.json({ status: 'success', cartUpdate });
        } catch (e) {
            return this.#handleError(res.e);
        }
    }

    async updateCartProductQuantity(req, res) {
        const cid = req.params.cid;
        const product = {
            pid: req.params.pid,
            quantity: req.body.quantity
        };

        try {
            const cartUpdate = await this.service.updateCartProductQuantity(cid, product);
            return res.json({ status: 'success', cartUpdate });
        } catch (e) {
            return this.#handleError(res, e);
        }
    }


    // TODO VER:
    // async getTotalProducts(req, res) {
    //     // Esta función capaz podria ir en algun 'utils'
    //     const cid = req.params.id;
    //     try {
    //         const total = await this.service.getTotalProducts(cid);
    //         return res.json(total);
    //     } catch (e) {
    //         return this.#handleError(res, e);
    //     }
    // }





};

module.exports = { CartsController };