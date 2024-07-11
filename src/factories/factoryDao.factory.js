// TODO: Exportar resto de DAOs
// TODO: Comentar

const { getPersistenceMethod } = require('../utils/main.utils.js');

const { mongoDAOs } = require('../dao/mongo/index.js');

const PERSISTENCE = getPersistenceMethod();

const loadDAOs = (PERSISTENCE) => {
    switch (PERSISTENCE) {
        case 'MONGO_DB':
            return {
                ProductDAO: new mongoDAOs.ProductsMongoDAO(),
                CartDAO: new mongoDAOs.CartsMongoDAO(),
            };

        case 'FILE':
            break;

        default:
            // TODO: Logger
            return console.log({ status: 'error', message: 'Persistence uknown - FactoryDao' });
    };
};

const { ProductDAO, CartDAO } = loadDAOs(PERSISTENCE);

class FactoryDAO {
    constructor() {
        this.productDAO = ProductDAO;
        this.cartDAO = CartDAO;
    }

    getProductDao() { return this.productDAO; };
    getCartDao() { return this.cartDAO; };
}


module.exports = { FactoryDAO };