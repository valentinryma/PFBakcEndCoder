const { areValidId, validateShcema } = require('../../utils/main.utils');

// TODO: Terminar el resto de metodos para las rutas.
// Validar (getCurrent no valida que exista y arroja un 200.)

class UsersController {
    constructor(service) {
        this.service = service;
    }

    async getCurrent(req, res) {
        if (!req || !req?.user) {
            // todo: LOGGER
            return res.status(400).json({ status: "error", error: "Not user in request" });
        }

        const user = req.user;

        return res.sendSuccessJSON(user);
    }

    async getAll(_, res) {
        const users = await this.service.getAll();

        return res.sendSuccessJSON(users);
    }

    async deleteAllInactives(_, res) {
        const usersDeleted = await this.service.deleteAllInactives();

        res.sendSuccessJSON({ status: "success", usersDeleted });
    }

    async setPremium(req, res) {
        const { uid } = req.params;

        const user = await this.service.setPremium(uid);

        // Asigna correctamente el token con el nuevo role

        const { accessToken, config } = await this.service.getCookieToken(user);

        res.cookie('accessToken', accessToken, config);

        return res.sendSuccessJSON(user);
    }

    async removePremium(req, res) {
        const { uid } = req.params;

        const user = await this.service.removePremium(uid);
        // Asigna correctamente el token con el nuevo role

        const { accessToken, config } = await this.service.getCookieToken(user);

        res.cookie('accessToken', accessToken, config);

        return res.sendSuccessJSON(user);
    }

    async login(req, res) {
        const user = req.user;

        const { accessToken, config, ttlJwt } = await this.service.getCookieToken(user);

        res.cookie('accessToken', accessToken, config);

        await this.service.setLastConnection(user._id)

        return res.sendSuccessJSON({
            user: user.email,
            accessToken,
            ttl:
            {
                cookie: config.maxAge / 1000 / 60 + 'm',
                jwt: ttlJwt
            }
        });
    }

    /**
    * @type { import('express').RequestHandler }
    */
    async logout(req, res) {
        if (!req?.user) {
            return res.sendSuccessJSON({ status: "not logged" });
        }

        await this.service.setLastConnection(req.user._id)

        res.clearCookie("accessToken");

        req.session.destroy(
            (_) => {
                return res.sendSuccessJSON({ status: "success" });
            }
        );

    }
}

module.exports = { UsersController };