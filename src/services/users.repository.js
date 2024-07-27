// TODO: Mail Service

const { generateTokenJWT } = require('../utils/jwt.js');

class UsersRepository {
    constructor(dao, dto) {
        this.dao = dao;

        this.dto = dto;
    }

    async getCurrent(uid) {
        const result = await this.dao.getById(uid);

        return await new this.dto(result);
    }

    async getAll() {
        const results = await this.dao.getAll();

        return results.map((user) => {
            const userDTO = new this.dto(user);

            delete (userDTO.id);

            delete (userDTO.age);

            delete (userDTO.lastName);

            return userDTO;
        });
    }

    async deleteAllInactives(req, res) {
        // TODO: Enviar mail de inactividad.

        return await this.dao.deleteAllInactives();
    }

    async setPremium(uid) {
        return await this.dao.setPremium(uid);
    }

    async removePremium(uid) {
        return await this.dao.removePremium(uid);
    }

    async getCookieToken(user) {
        if (!user) {
            //todo error handler
            console.log('Error no user in request');
        }

        // TODO! UNIFICAR TTL DE LOS TOKEN AccessToken (cookie y jwt)

        const ttlJwt = '24h'
        const ttlCookieToken = 3600000;

        // const ttlMessage = (process.env.TTL_TOKEN / 3600000) >= 1
        // \? `${(process.env.TTL_TOKEN / 3600000)}hs`
        // : `${(process.env.TTL_TOKEN / 1000 / 60)}min`;

        const accessToken = generateTokenJWT(
            {
                id: user._id,
                email: user.email,
                role: user.role
            },
            ttlJwt
        );

        const config = { maxAge: ttlCookieToken, httpOnly: true }

        return { accessToken, config, ttlJwt };
    }

    async setLastConnection(uid) {
        await this.dao.setLastConnection(uid);
    }
}

module.exports = { UsersRepository };