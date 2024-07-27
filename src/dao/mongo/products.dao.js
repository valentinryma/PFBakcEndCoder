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
        return await ProductModel.paginate(query, options);
    };

    async getById(pid) {
        const product = await ProductModel.findById(pid);

        if (!product) {
            throw new Error('user not found');
        }

    };

    async create(product) {
        // const { title, price, code, status, stock, category, thumbnails, owner } = product;
        return await ProductModel.create(product);
    };

    async deleteById(pid) {
        const { deletedCount } = await ProductModel.deleteOne({ _id: pid });

        if (deletedCount == 0) {
            // TODO: Loggear - Custom Error
            console.log('Product Not Found')
        };

        return deletedCount;
    };
};

module.exports = { ProductsMongoDAO };