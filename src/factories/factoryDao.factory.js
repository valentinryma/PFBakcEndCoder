// TODO: Exportar resto de DAOs
// TODO: Comentar

const { getPersistenceMethod } = require('../utils/main.utils.js');

const { mongoDAOs } = require('../dao/mongo/index.js');

const PERSISTENCE = getPersistenceMethod();

const loadDAOs = (PERSISTENCE) => {
    switch (PERSISTENCE) {
        case 'MONGO_DB':
            return new mongoDAOs.ProductsMongoDAO();

        case 'FILE':
            break;

        default:
            // TODO: Logger
            return console.log({ status: 'error', message: 'Persistence uknown - FactoryDao' });
    };
};

const ProductDAO = loadDAOs(PERSISTENCE);

class FactoryDAO {
    constructor() {
        this.productDAO = ProductDAO;
    }

    getProductDao() { return this.productDAO; };
}


module.exports = { FactoryDAO };