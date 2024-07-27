const mongoose = require('mongoose');

const collection = 'users';

const schema = new mongoose.Schema(
    {
        firstName: { type: String, require: true },

        lastName: { type: String, require: true },

        email: { type: String, require: true, unique: true },

        age: { type: Number, require: false },

        password: { type: String, require: false },

        cart: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Cart'
        },

        role: { type: String, default: 'user' },

        documents: [
            {
                name: { type: String, require: false },
                reference: { type: String, require: false }
            }
        ],

        last_connection: { type: Date, require: false }
    }
)

module.exports = mongoose.model('User', schema, collection);