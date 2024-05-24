// Model
const UserModel = require(`${__dirname}/../../models/user.model.js`);

class UsersMongoDAO {
    constructor() { }

    async prepare() {
        if (UserModel.db.readyState != 1) {
            throw new Error('Must connect to MongoDB');
        }
    }

    async getById(id) {
        const user = await UserModel.findOne({ _id: id });
        if (!user) throw new Error('user not found');
        return user;
    }

}

module.exports = { UsersMongoDAO }