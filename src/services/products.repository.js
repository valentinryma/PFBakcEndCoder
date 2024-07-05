// TODO: DTO.
// ! TODO: Terminar rutas.
// - TODO: Mejorar comentarios.
// - TODO: Modificar sort, para que se pueda ordenar por x campo

const dto = require('../dtos/users.dto.js');

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

        if (category) conditions.push({ status });

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

        // TODO: Verificar si funciona - Mejorar para que pueda utilizar otros campos ademas de price.
        if (sort) paginateOptions.sort = {
            sort: { price: + sort }
        };

        const products = await this.dao.getAll(query, paginateOptions);

        products.payload = getDTO(products, this.dto);

        delete products.docs;

        return products;
    };
};

module.exports = { ProductsRepository };