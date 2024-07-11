const { areValidId, validateShcema } = require('../utils/main.utils');

class CartsController {
    constructor(service) {
        this.service = service;
    };

    async getAll(_, res) {
        const carts = await this.service.getAll();

        return res.json({ status: "success", payload: carts });
    };

    async getById(req, res) {
        const cid = req.params.cid;

        if (!areValidId(cid)) {
            return res.json({ status: "error", message: "Id is not valid" })
        };

        const cart = await this.service.getById(cid);

        res.json({ status: "success", payload: cart });
    };

    async create(_, res) {
        // Todo Retornar en la res.json el id del cart empty creado.
        const newCart = await this.service.create();

        return res.json({ status: "success", payload: newCart });
    };

    async addProduct(req, res) {
        const { cid, pid } = req.params;

        if (!areValidId(cid, pid)) {
            return res.json({ status: "error", message: "Id is not valid" })
        };

        const quantity = req.body?.quantity || 1;

        const cartUpdate = await this.service.addProduct(cid, pid, quantity);

        return res.json({ status: "success", payload: cartUpdate });
    };

    async removeProduct(req, res) {
        const { cid, pid } = req.params;

        if (!areValidId(cid, pid)) {
            return res.json({ status: "error", message: "Id is not valid" })
        };

        await this.service.removeProduct(cid, pid);

        return res.json({ status: "success" });
    };

    async deleteById(req, res) {
        const { cid } = req.params;

        if (!areValidId(cid)) {
            return res.json({ status: "error", message: "Id is not valid" });
        };

        await this.service.deleteById(cid);

        res.json({ status: "success" });
    };
};

module.exports = { CartsController };