// TODO: Verificar retorno de las rutas y estandarizar (Ej: {payload: users})

//! TODO: Terminar rutas
//! TODO: Revisar seguridad - No se esta validnado req.query (filters)

class ProductsController {
    constructor(repository) {
        this.repository = repository;
    };

    async getAll(req, res) {
        const filters = req.query;

        const data = await this.repository.getAll(filters)

        const products = data.payload;

        return res.json({ status: "success", payload: products });
    };
};

module.exports = { ProductsController };