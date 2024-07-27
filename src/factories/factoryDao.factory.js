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
                UserDAO: new mongoDAOs.UsersMongoDAO()
            };

        case 'FILE':
            break;

        default:
            // TODO: Logger
            return console.log({ status: 'error', message: 'Persistence uknown - FactoryDao' });
    };
};

const {
    ProductDAO,
    CartDAO,
    UserDAO
} = loadDAOs(PERSISTENCE);

class FactoryDAO {
    constructor() {
        this.productDAO = ProductDAO;
        this.cartDAO = CartDAO;
        this.userDAO = UserDAO;
    }

    getProductDao() { return this.productDAO; };

    getCartDao() { return this.cartDAO; };

    getUserDao() { return this.userDAO; };
}


module.exports = { FactoryDAO };