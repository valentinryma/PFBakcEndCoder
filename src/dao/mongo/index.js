const { ProductsMongoDAO } = require('../mongo/products.dao.js');

const { CartsMongoDAO } = require('../mongo/carts.dao.js');

const { UsersMongoDAO } = require('../mongo/users.dao.js');

const mongoDAOs = {
    ProductsMongoDAO,
    CartsMongoDAO,
    UsersMongoDAO
};

module.exports = { mongoDAOs };