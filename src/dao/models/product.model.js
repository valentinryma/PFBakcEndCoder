const mongoose = require('mongoose');

const mongoosePaginate = require('mongoose-paginate-v2');

const collection = 'products';

const schema = new mongoose.Schema(
    {
        title: { type: String, require: true },

        price: { type: Number, require: true },

        code: { type: String, require: true },

        status: { type: String, require: true },

        stock: { type: Number, require: true },

        category: { type: String, require: true },

        thumbnails: [{ type: String, require: false }],

        owner: { type: String, require: true },
    }
);

schema.virtual('id').get(function () {
    return this._id.toString();
})

schema.plugin(mongoosePaginate);
module.exports = mongoose.model('Product', schema, collection);