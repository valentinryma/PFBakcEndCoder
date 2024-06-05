// Custom Erros & Validations
const { CustomError } = require(`../errors/CustomError.js`);
const { ErrorCodes } = require(`${__dirname}/../errors/errorCodes.js`);

// Generals Errors
const { generateInvalidObjectIdError } = require(`../errors/generals/generals.error.js`);

// Carts Errors
const { generateCartNotFoundError } = require(`../carts/carts.error.js`)

// Products Errors
const { generateProductNotFoundError } = require(`../products/products.error.js`)

// Typeof con el que se comparará los IDs
const { isValidObjectId } = require('mongoose');

/**
 * Processes an array of IDs, filtering out invalid ones and transforming the valid IDs into objects.
 * 
 * @param {string[]} ids - An array of IDs to be processed.
 * @throws {Error} Throws an error if no valid IDs are provided.
 * @returns {Object[]} Returns an array of objects, each containing a valid ID.
 * @property {string} id - The valid ID.
 */
const validateIds = (...ids) => {
    if (ids.length === 0) {
        throw CustomError.createError({
            name: 'NoValidIdsProvided',
            cause: 'No valid IDs provided',
            message: 'Error: No valid IDs provided',
            code: ErrorCodes.INVALID_TYPES_ERROR
        })
    }

    ids.forEach((id) => {
        if (!isValidObjectId(id)) {
            throw CustomError.createError({
                name: 'InvalidObjectId',
                cause: generateInvalidObjectIdError({ id }),
                message: 'Error The format of the ObjectId is not valid',
                code: ErrorCodes.INVALID_TYPES_ERROR
            })
        }
    })

    return true
}

/**
 * Validates if the provided model is found, throwing an error if not.
 *
 * @param {Object|null} model - The model to be validated.
 * @param {string} id - The ID associated with the model.
 * @param {string} type - The type of the model (e.g., 'cart', 'product').
 * @throws {CustomError} Throws a specific error if the model is not found, based on the type.
 * @returns {boolean} - Returns true if the model is found.
 */
const validateModelIsFound = (model, id, type) => {
    type = type.toLowerCase();

    if (!model) {
        switch (type) {
            case 'cart':
                throw CustomError.createError({
                    name: 'CartNotFound',
                    cause: generateCartNotFoundError({ id }),
                    message: 'Cart not found',
                    code: ErrorCodes.CART_NOT_FOUND
                });

            case 'product':
                throw CustomError.createError({
                    name: 'ProductNotFound',
                    cause: generateProductNotFoundError({ id }),
                    message: 'Product not found',
                    code: ErrorCodes.PRODUCT_NOT_FOUND
                });

            default:
                throw CustomError.createError({
                    name: 'modelUknown',
                    cause: `El modelo que se intenta validar es desconocido.\nrecived:\n- Model: ${model} - type [ ${typeof model} ],\n- Id: ${id} - type [ ${typeof id} ],\n- Type: ${type} - type [ ${typeof type} ]`,
                    message: 'Model uknwon',
                    code: ErrorCodes.DATABASE_ERROR
                });
        }
    }

    return true
}

/**
 * Finds a model by ID and validates if it is found, throwing an error if not.
 *
 * @param {Object} model - The Mongoose model to query.
 * @param {string} id - The ID of the model to be found.
 * @param {string} type - The type of the model (e.g., 'cart', 'product').
 * @throws {CustomError} Throws a specific error if the model is not found, based on the type.
 * @returns {Promise<Object|null>} Returns a promise that resolves to the found model object or null if not found.
 */
const findAndValidateModelIsFound = async (model, id, type) => {
    const modelFound = await model.findOne({ _id: id });
    validateModelIsFound(modelFound, id, type);

    return modelFound;
}


module.exports = {
    validateIds,
    validateModelIsFound,
    findAndValidateModelIsFound
}

