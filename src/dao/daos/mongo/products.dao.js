// Model
const ProductModel = require(`${__dirname}/../../models/product.model.js`);

// Customs Errors & Validations
const { CustomError } = require(`../../../services/errors/CustomError.js`);
const { ErrorCodes } = require(`../../../services/errors/errorCodes.js`);

const { generateDBNotAlreadyError } = require(`../../../services/errors/generals/generals.error.js`); // Generals Errors
const { generateProductNotFoundError, generateProductNotDeleteError } = require(`../../../services/products/products.error.js`); // Product Errors

class ProductsMongoDAO {
    constructor() { }

    // Verifique este establecida la conexion con la db.
    async prepare() {
        const readyState = ProductModel.db.readyState
        if (readyState != 1) {
            throw CustomError.createError({
                name: 'DBNotAlready',
                cause: generateDBNotAlreadyError({ readyState }),
                message: 'Data base is not already',
                code: ErrorCodes.DATABASE_ERROR
            });
        }
    }

    async getAll(query, options) {
        const products = await ProductModel.paginate(query, options);
        return products;
    }

    async getById(id) {
        const product = await ProductModel.findOne({ _id: id });

        if (!product) {
            throw CustomError.createError({
                name: 'ProductNotFound',
                cause: generateProductNotFoundError({ id }),
                message: 'Product not found',
                code: ErrorCodes.PRODUCT_NOT_FOUND
            });
        }

        return product;
    }

    async createOne(product) {
        const newProduct = await ProductModel.create(product);
        return newProduct;
    }

    async deleteById(id) {
        const productDelete = await ProductModel.deleteOne({ _id: id });

        if (productDelete.deletedCount == 0) {
            throw CustomError.createError({
                name: 'ProductNotDelete',
                cause: generateProductNotDeleteError({ id }),
                message: 'Product can not delete',
                code: ErrorCodes.PRODUCT_DELETION_FAILED
            });
        }

        return productDelete;

    }
}

module.exports = { ProductsMongoDAO };