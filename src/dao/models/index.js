const ProductModel = require('./product.model.js');

const getReadyState = (Model) => {
    return Model.db.readyState != 1;
}

const models = {
    ProductModel,
    getReadyState
};

module.exports = models;
