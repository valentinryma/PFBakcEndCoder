const { ProductsMongoDAO } = require('../mongo/products.dao.js');
const { CartsMongoDAO } = require('../mongo/carts.dao.js');

const mongoDAOs = {
    ProductsMongoDAO,
    CartsMongoDAO
};

module.exports = { mongoDAOs };