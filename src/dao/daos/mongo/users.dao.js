// Model
const UserModel = require(`${__dirname}/../../models/user.model.js`);
const { CustomError } = require(`../../../services/errors/CustomError.js`);
const { ErrorCodes } = require(`../../../services/errors/errorCodes.js`);
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

    async getByEmail(email) {
        const user = await UserModel.findOne({ email: email });
        if (!user) {
            throw CustomError.createError({
                name: 'UserNotFound',
                cause: 'User is not found',
                message: 'Error trying to restore password',
                code: ErrorCodes.USER_NOT_FOUND
            })
        }

        return user;
    }
    async resetPassword(email, newPassword) {
        return await UserModel.updateOne({ email }, { $set: { password: newPassword } });
    }

    async turnPremiumRole(id) {
        const user = await UserModel.findOne({ _id: id });
        if (!user) {
            throw CustomError.createError({
                name: 'UserNotFound',
                cause: 'User is not found',
                message: 'Error trying to restore password',
                code: ErrorCodes.USER_NOT_FOUND
            })
        }

        const isPremium = user.role === 'premium';
        if (isPremium) {
            await UserModel.updateOne({ _id: id }, { $set: { role: 'user' } })
        } else {
            await UserModel.updateOne({ _id: id }, { $set: { role: 'premium' } })
        }

        const newRole = (await UserModel.findOne({ _id: id })).role;
        return newRole
    }

}

module.exports = { UsersMongoDAO }