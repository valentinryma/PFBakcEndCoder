/**
 * @class CustomError
 * @classdesc CustomError is a class for creating and throwing customized errors with additional properties.
 */

class CustomError {

    /**
     * Creates and throws a custom error with the specified properties.
     * @param {string} name - The name of the error.
     * @param {any} cause - The cause of the error.
     * @param {string} message - The error message.
     * @param {string|number} code - The error code.
     * @throws Throws a custom `object error` with the provided properties.
     */
    static createError({
        name,
        cause,
        message,
        code
    }) {
        const error = new Error(message);
        error.name = name;
        error.cause = cause;
        error.code = code;

        throw error;
    }
}

module.exports = { CustomError };