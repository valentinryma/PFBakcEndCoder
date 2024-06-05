// Custom Erros & Validations
const { CustomError } = require(`${__dirname}/../errors/CustomError.js`);
const { ErrorCodes } = require(`${__dirname}/../errors/errorCodes.js`);
const { generateInvalidProductDataError } = require(`${__dirname}/products.error.js`);
const { validateIds } = require(`${__dirname}/../util-services/utils.services.js`);


class ProductsRepository {
    constructor(dao) {
        this.dao = dao;
    }

    async getAll(filters = null) {
        // Query Filters
        const title = filters && filters.title;
        const status = filters && filters.status;
        const category = filters && filters.category;

        // Query Paginate - Options
        const limit = (filters && filters.limit) || 10;
        const page = (filters && filters.page) || 1;
        let sort = (filters && filters.sort);

        const conditions = []

        // Query Filters 
        if (title) {
            conditions.push({
                title: {
                    $regex: `^${title}`,
                    $options: 'i' // Insensitive
                }
            });
        }

        if (category) conditions.push({ category });
        if (status) conditions.push({ status });

        // Query final & Query Options
        const query = { $and: conditions }
        const options = { limit, page, lean: true }

        // Si tiene sort, lo agrega a las opciones, sino no aplica ningun ordenamiento.
        if (sort) {
            options.sort = { price: +sort }
        }

        // Si hay condiciones, aplica el filtrado de resultado, sino unicamente las opciones de paginate
        const products = conditions.length
            ? await this.dao.getAll(query, options)
            : await this.dao.getAll({}, options);

        // Reemplaza "docs" por "payload"
        products.payload = products.docs;
        delete products.docs;

        return products
    }

    async getById(id) {
        // Valida que sea un ObjectId valido.
        validateIds(id)

        await this.dao.getById(id);
    }

    async createOne(product) {
        // Verificamos los datos
        const { title, code, price, status, stock, category, thumbnails } = product;

        // Valida la Data del Producto
        if (!title || !code || !price || !status || !stock || !category) {
            throw CustomError.createError({
                name: 'InvalidProductData',
                cause: generateInvalidProductDataError({ title, code, price, status, stock, category, thumbnails }),
                message: 'Error trying to create a new product',
                code: ErrorCodes.INVALID_TYPES_ERROR
            })
        }

        return await this.dao.createOne(product);
    }

    async deleteById(id) {
        // Valida que sea un ObjectId valido.
        validateIds(id)

        // Verifica que haya un user al momento antes de intentar eleminar el producto en el dao
        await this.dao.getById(id);

        return await this.dao.deleteById(id);
    }
}

module.exports = { ProductsRepository };