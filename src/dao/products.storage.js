// Model
const ProductModel = require(`${__dirname}/models/product.model.js`);

class ProductsStorage {
    constructor() { }

    async prepare() {
        if (ProductModel.db.readyState != 1) {
            throw new Error('Must connect to MongoDB');
        }
    }

    async getAll(query, options) {
        const products = await ProductModel.paginate(query, options);
        // console.log(`Productos encontrados: ${products}`);
        return products;

    }

    async getById(id) {
        const product = await ProductModel.findOne({ _id: id });
        if (!product) throw new Error('not found');

        // console.log(`Producto encontrado: ${product}`);
        return product;
    }

    async createOne(product) {
        try {
            const newProduct = await ProductModel.create(product);
            // console.log(`Producto creado: ${newProduct}`);
            return newProduct;
        } catch (e) {
            console.log(`Error en ${__dirname} - createOne`, e);
            throw new Error(e)
        }
    }

    async deleteById(id) {
        try {
            const productDelete = await ProductModel.deleteOne({ _id: id });
            if (productDelete.deletedCount == 0) {
                throw new Error('not found');
            }

            // console.log(`Producto eliminado: ${productDelete}`);
            return productDelete;
        } catch (e) {
            console.log(`Error en ${__dirname} - deleteById`, e);
            throw new Error(e)
        }
    }
}

module.exports = { ProductsStorage };