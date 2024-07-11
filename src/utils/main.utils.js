// TODO: Comentar
// Ver si es necesario separar en diferentes archiovs (Catregorizare utils)

const getPersistenceMethod = () => {
    return process.env.PERSISTENCE || process.argv.PERSISTENCE || 'MONGO';
};

// Aplica el DTO para cada producto y lo devuelve en product.payload (contiene metadatos)
// Le podes pasar cualquier DTO (Para que dependiendo de donde lo llames, puedas traer mas o menos info.)
const getDTO = (resultsModel, dto) => {
    // Collection de user, products, carts, etc.
    const results = resultsModel.map(
        (data) => {
            return new dto(data).toJSON();
        }
    );

    return results;
};


const { isValidObjectId } = require("mongoose");
const areValidId = (...ids) => {

    if (ids.length == 0) {
        return;
    }

    // TODO: Logger dentro de ids.every para que especifique cual fue la id invalida.

    return ids.every((id) => isValidObjectId(id));
}

/**
 * Valida el esquema del modelo con los datos de la solicitud.
 *
 * @param {Object} model - El modelo que contiene el esquema de validación.
 * @param {Object} req - El objeto de la solicitud HTTP.
 * @param {Object} res - El objeto de la respuesta HTTP.
 * @returns {Object} - La respuesta en formato JSON con el estado y el mensaje de error si hay una validación fallida.
 * 
 * Si no hay error, simplemente continua la ejecución.
 */
const validateShcema = (model, req, res) => {
    const { error } = model.validate(req.body);

    if (error) {
        return res.json({ status: "error", message: error.details[0].message })
    };
};

module.exports = {
    getPersistenceMethod,
    getDTO,
    areValidId,
    validateShcema
};