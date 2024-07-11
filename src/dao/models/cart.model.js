const mongoose = require("mongoose");

const mongoosePaginate = require("mongoose-paginate-v2")

const collection = "cart";

const schema = new mongoose.Schema({
    products: [
        {
            _id: {
                type: mongoose.Schema.Types.ObjectId,
                require: true,
                ref: 'Product'
            },
            quantity: { type: Number, require: true }
        }
    ],
});

// schema.virtual('id').get(function () {
//     return this._id.toString();
// });

schema.plugin(mongoosePaginate);

module.exports = mongoose.model("Cart", schema, collection);

