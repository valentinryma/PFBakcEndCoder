class CartsController {
    // Service: repository.
    constructor(service) {
        this.service = service;
    }

    async getAll(_, res) {
        const carts = await this.service.getAll();
        return res.json(carts);
    }

    async getById(req, res) {
        const id = req.params.id;

        const cart = await this.service.getById(id);
        return res.json(cart);
    }

    async createOne(_, res) {
        const emptyCart = await this.service.createOne();
        return res.json(emptyCart);
    }

    async deleteById(req, res) {
        const id = req.params.id;

        const cartDelete = await this.service.deleteById(id);
        return res.json({ status: 'success', cartDelete });

    }

    async addProductInCart(req, res) {
        const cid = req.params.cid;
        const pid = req.params.pid;
        const quantity = (req.body?.quantity || 1);

        const cartUpdate = await this.service.addProductInCart(cid, pid, quantity);
        return res.json({ status: 'success', cartUpdate })

    }

    async deleteProductInCart(req, res) {
        const cid = req.params.cid;
        const pid = req.params.pid;

        const cartUpdate = await this.service.deleteProductInCart(cid, pid);
        return res.json({ status: 'success', cartUpdate })
    }

    async updateCartProductArray(req, res) {
        const cid = req.params.id;
        const productArray = req.body

        const cartUpdate = await this.service.updateCartProductArray(cid, productArray);
        return res.json({ status: 'success', cartUpdate });

    }

    async updateCartProductQuantity(req, res) {
        const cid = req.params.cid;
        const pid = req.params.pid;
        const quantity = req.body?.quantity;

        const cartUpdate = await this.service.updateCartProductQuantity(cid, pid, quantity);
        return res.json({ status: 'success', cartUpdate });

    }

    async getTotalProducts(req, res) {
        // Esta función capaz podria ir en algun 'utils'
        const cid = req.params.id;

        const total = await this.service.getTotalProducts(cid);
        return res.json(total);

    }

    async purchase(req, res) {
        const cid = req.params.cid;
        const purchaserEmail = req.user.email;

        const [ticket, cart] = await this.service.purchase(cid, purchaserEmail);

        console.log({ status: 'success', ticket, cart });
        return res.json({ status: 'success', ticket, cart });

    }
};

module.exports = { CartsController };