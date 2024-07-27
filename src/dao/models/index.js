const ProductModel = require('./product.model.js');

const CartModel = require('./cart.model.js');

const UserModel = require('./user.model.js');

const getReadyState = (Model) => {
    return Model.db.readyState != 1;
}

const models = {
    ProductModel,
    CartModel,
    UserModel,
    getReadyState
};

module.exports = models;
