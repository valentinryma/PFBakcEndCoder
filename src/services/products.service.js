class ProductsService {
    constructor(storage) {
        this.storage = storage;
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
            ? await this.storage.getAll(query, options)
            : await this.storage.getAll({}, options);

        // Reemplaza "docs" por "payload"
        products.payload = products.docs;
        delete products.docs;

        return products
    }

    async getById(id) {
        return await this.storage.getById(id);
    }

    async createOne(product) {
        // Verificamos los datos
        const { title, code, price, status, stock, category, thumbnails } = product
        if (!title || !code || !price || !status || !stock || !category) {
            throw new Error('invalid parameters');
        }

        return await this.storage.createOne(product);
    }

    async deleteById(id) {
        return await this.storage.deleteById(id);
    }
}

module.exports = { ProductsService };