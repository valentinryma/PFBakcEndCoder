const dto = require('../dtos/carts.dto.js');

const { getDTO } = require('../utils/main.utils.js');

class CartsRepository {
    constructor(dao) {
        this.dao = dao;

        this.dto = dto; // Medio redundante, despues ver si es necsario o directamente usarlo desde el require
    };

    async getAll() {
        // TODO: Verificar si carts.products neceista el DTO tmb.
        const carts = await this.dao.getAll();

        return getDTO(carts, this.dto);
    };

    async getById(cid) {
        // Configurar DTO para los productos de esta ruta particualr
        return await this.dao.getById(cid);
    };

    async create() {
        const newCart = await this.dao.create();
        return new dto(newCart).toJSON();
    };

    async addProduct(cid, pid, quantity = 1) {
        // TODO: CustomErrors - ErrorHandler
        return await this.dao.addProduct(cid, pid, quantity);
    };

    async removeProduct(cid, pid) {
        return await this.dao.removeProduct(cid, pid);
    }

    async deleteById(cid) {
        return await this.dao.deleteById(cid);
    }
};

module.exports = { CartsRepository };