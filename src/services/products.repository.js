// TODO: DTO.
// ! TODO: Terminar rutas.
// - TODO: Mejorar comentarios.
// - TODO: Modificar sort, para que se pueda ordenar por x campo

const dto = require('../dtos/products.dto.js');

const { getDTO } = require('../utils/main.utils.js');

class ProductsRepository {
    constructor(dao) {
        this.dao = dao;
        this.dto = dto;
    };

    async getAll(filters = null) {
        // Query Filters
        const {
            title,
            status,
            category,
            limit = 10,
            page = 1,
            sort
        } = filters || {};

        const conditions = [];

        if (title) {
            conditions.push({
                title: {
                    $regex: `^${title}`,
                    $options: 'i'
                }
            });
        };

        if (category) conditions.push({ category });

        if (status) conditions.push({ status });

        // Consulta final & Opciones.
        const query = conditions.length > 0
            ? { $and: conditions }
            : {};

        const paginateOptions = {
            limit,
            page,
            lean: true,
            sort: null
        }

        // TODO: Arreglar! No anda.
        // if (sort) paginateOptions.sort = {
        //     sort: { price: +sort }
        // };

        const products = await this.dao.getAll(query, paginateOptions);

        products.payload = getDTO(products.docs, this.dto);

        delete products.docs;

        return products;
    };

    // Toggle DTO in Object config.
    async getById(pid, config = null) {
        // TODO: Validar Id's - errorHandler - Logger
        const product = await this.dao.getById(pid);

        if (!product) {
            // TODO: CustomError
            return [];
        };

        if (config?.useDto) {
            return new dto(product);
        };

        return product;
    };

    async create(product) {
        const newProduct = await this.dao.create(product);

        return await new dto(newProduct);
    };

    async deleteById(pid) {
        // TODO: Si el user es premium, enviar notificación via mail.

        return await this.dao.deleteById(pid);
    };
};

module.exports = { ProductsRepository };