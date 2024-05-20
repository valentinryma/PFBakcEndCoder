class UsersService {
    constructor(storage) {
        this.storage = storage;
    }

    async getById(id) {
        console.log(this.storage)
        return await this.storage.getById(id);
    }
}

module.exports = { UsersService }