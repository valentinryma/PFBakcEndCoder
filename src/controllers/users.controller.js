class UsersController {
    constructor(service) {
        this.service = service;
    }

    #handleError(res, e) {
        if (e.message === 'invalid parameters') return res.status(400).json('Invalid parameters');
        if (e.message === 'not found') return res.status(404).json('Not found');
        return res.status(500).json({ error: e.message });
    }

    async getByIdFormat(req, res) {
        try {
            const id = req.user._id.toString();
            const user = await this.service.getByIdFormat(id);
            res.sendSuccess({ user });
        } catch (e) {
            return this.#handleError(res, e);
        }

    }
}

module.exports = { UsersController };