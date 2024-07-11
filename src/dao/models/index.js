const ProductModel = require('./product.model.js');
const CartModel = require('./cart.model.js');

const getReadyState = (Model) => {
    return Model.db.readyState != 1;
}

const models = {
    ProductModel,
    CartModel,
    getReadyState
};

module.exports = models;
