// TODO: Verificar retorno de las rutas y estandarizar (Ej: {payload: users})
// TODO: Terminar de loggear todos los console log y repuestas de "error".
//! TODO: Terminar rutas
//! TODO: Revisar seguridad - No se esta validnado req.query (filters)

const { areValidId, validateShcema } = require('../utils/main.utils');

const Joi = require('joi');

const validateProductSchema = Joi.object({
    title: Joi.string().required(),

    price: Joi.number().required(),

    code: Joi.string().required(),

    status: Joi.boolean().required(),

    stock: Joi.number().required(),

    thumbnails: Joi.array().items(Joi.string()),

    category: Joi.string().required(),

    owner: Joi.string().required()
})

class ProductsController {
    constructor(repository) {
        this.repository = repository;
    };

    async getAll(req, res) {
        const filters = req.query;

        const results = await this.repository.getAll(filters)

        return res.json({ status: "success", payload: results.payload });
    };

    async getById(req, res) {
        const pid = req.params.pid;

        // TODO: Mover a repository y agregar erroHandler para que desde el mismo error se envie la res y logge el error.
        if (!areValidId(pid)) {
            return res.json({ status: "error", message: "Id is not valid" })
        }

        const product = await this.repository.getById(pid, { useDto: true });

        res.json({ status: "success", payload: product });
    };

    async create(req, res) {
        // TODO: JOI para validar los req.body

        // Ver si isValidReques es conviente pasarlo a un middleware
        validateShcema(validateProductSchema, req, res);

        const newProduct = await this.repository.create(req.body);

        return res.json({ status: "success", payload: newProduct });
    };

    async deleteById(req, res) {
        const pid = req.params.pid;

        // TODO: Mover a repository y agregar erroHandler para que desde el mismo error se envie la res y logge el error.
        if (!areValidId(pid)) {
            return res.json({ status: "error", message: "Id is not valid" });
        };

        await this.repository.deleteById(pid);

        res.json({ status: "success" });
    };
};

module.exports = { ProductsController };