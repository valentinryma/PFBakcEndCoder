const mongoose = require('mongoose');
const collection = 'tickets';
const schema = new mongoose.Schema({
    code: { type: String, require: true, unique: true },
    purchase_datatime: { type: Date, default: Date.now }, // TODO: ver si es el type correcto
    amount: { type: Number },
    purchaser: { type: String }
});

// Virtual
schema.virtual('id').get(function () {
    return this._id.toString();
});
module.exports = mongoose.model('Ticket', schema, collection);