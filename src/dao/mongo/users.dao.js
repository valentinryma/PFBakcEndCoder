// TODO: CustomErrors & ErrorCodes
// TODO: Seguridad (Verificar query / options)

const { getReadyState, UserModel } = require('../models/index.js');

class UsersMongoDAO {
    constructor() { }

    async prepare() {
        if (getReadyState(UserModel)) {
            throw new Error('Must connect to MongoDB');
        }
    }

    async getAll() {
        return await UserModel.find();
    }

    async getById(uid) {
        const user = await UserModel.findById(uid);

        if (!user) {
            throw new Error('user not found');
        }

        return user;
    }

    async getByEmail(email) {
        const user = await UserModel.findOne({ email });

        if (!user) {
            throw new Error('user not found');
        }

        return user;
    }

    // TODO
    async deleteAllInactives() {
        const currentDate = new Date();

        const twoDaysAgo = new Date(currentDate);

        twoDaysAgo.setDate(currentDate.getDate() - 2);

        const results = await UserModel.deleteMany(
            {
                last_connection:
                {
                    $lt: twoDaysAgo
                }
            }
        );

        return results.deletedCount;
    }

    async setPremium(uid) {
        const user = await UserModel.findOne({ _id: uid });

        if (user.role.toUpperCase() == 'PREMIUM') {
            return user;
        }

        await UserModel.updateOne(
            { _id: uid },
            { $set: { role: 'premium' } }
        );
        const userUpdate = await UserModel.findOne({ _id: uid });

        return userUpdate;
    }

    async removePremium(uid) {
        const user = await UserModel.findOne({ _id: uid });

        if (user.role.toUpperCase() !== 'PREMIUM') {
            return user;
        }

        await UserModel.updateOne(
            { _id: uid },
            { $set: { role: 'user' } }
        );

        const userUpdate = await UserModel.findById(uid);

        return userUpdate;
    }

    async setLastConnection(uid) {
        const user = await UserModel.findById(uid);

        if (!user) {
            throw new Error('user not found');
        }

        await UserModel.updateOne(
            { _id: uid },
            { $set: { last_connection: new Date() } }
        )

        return await UserModel.findById(uid);
    }

    // TODO
    /**
     * resetPassword(email, newPassword)
     */
}

module.exports = { UsersMongoDAO }