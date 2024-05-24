class UsersRepository {
    constructor(dao, dto) {
        this.dao = dao;
        this.dto = dto;
    }

    async getById(id) {
        return await this.dao.getById(id);
    }

    async getByIdFormat(id) {
        const result = await this.dao.getById(id);
        return await new this.dto(result);
    }
}

module.exports = { UsersRepository }