// TODO: CustomErrors & ErrorCodes
// TODO: Seguridad (Verificar query / options)

//! TODO: Terminar rutas [🎯]

const { ProductModel, getReadyState } = require('../models/index.js');

class ProductsMongoDAO {
    constructor() { };

    async prepare() {
        if (!getReadyState(ProductModel)) {
            // Error logger
            return console.log('DB not already');
        };
    };

    async getAll(query, options) {
        const products = await ProductModel.paginate(query, options);

        return products;
    }
};

module.exports = { ProductsMongoDAO };