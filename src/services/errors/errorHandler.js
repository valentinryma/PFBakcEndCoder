const { ErrorCodes } = require(`./errorCodes.js`);

/**
 * @type {import("express").ErrorRequestHandler}
 */
const errorHandler = (error, req, res, next) => {
    errorMessageFormat(req, error);

    switch (error.code) {
        // General Errors
        case ErrorCodes.ROUTING_ERROR:
            res.status(500).send({ status: 'error', error: error.message });
            break;
        case ErrorCodes.INVALID_TYPES_ERROR:
            res.status(400).send({ status: 'error', error: error.message });
            break;
        case ErrorCodes.DATABASE_ERROR:
            res.status(500).send({ status: 'error', error: error.message });
            break;
        case ErrorCodes.AUTHENTICATION_ERROR:
            res.status(401).send({ status: 'error', error: error.message });
            break;
        case ErrorCodes.AUTHORIZATION_ERROR:
            res.status(403).send({ status: 'error', error: error.message });
            break;

        // Products Errors
        case ErrorCodes.PRODUCT_NOT_FOUND:
            res.status(404).send({ status: 'error', error: error.message });
            break;
        case ErrorCodes.PRODUCT_ALREADY_EXISTS:
            res.status(409).send({ status: 'error', error: error.message });
            break;
        case ErrorCodes.PRODUCT_CREATION_FAILED:
            res.status(500).send({ status: 'error', error: error.message });
            break;
        case ErrorCodes.PRODUCT_UPDATE_FAILED:
            res.status(500).send({ status: 'error', error: error.message });
            break;
        case ErrorCodes.PRODUCT_DELETION_FAILED:
            res.status(500).send({ status: 'error', error: error.message });
            break;

        // Carts Errors
        case ErrorCodes.CART_NOT_FOUND:
            res.status(404).send({ status: 'error', error: error.message });
            break;
        case ErrorCodes.CART_CREATION_FAILED:
            res.status(500).send({ status: 'error', error: error.message });
            break;
        case ErrorCodes.CART_UPDATE_FAILED:
            res.status(500).send({ status: 'error', error: error.message });
            break;
        case ErrorCodes.CART_DELETION_FAILED:
            res.status(500).send({ status: 'error', error: error.message });
            break;
        case ErrorCodes.CART_ITEM_NOT_FOUND:
            res.status(404).send({ status: 'error', error: error.message });
            break;
        case ErrorCodes.CART_ITEM_ADD_FAILED:
            res.status(500).send({ status: 'error', error: error.message });
            break;
        case ErrorCodes.CART_ITEM_REMOVE_FAILED:
            res.status(500).send({ status: 'error', error: error.message });
            break;

        // Users Errors
        case ErrorCodes.USER_NOT_FOUND:
            res.status(404).send({ status: 'error', error: error.message });
            break;
        case ErrorCodes.USER_ALREADY_EXISTS:
            res.status(409).send({ status: 'error', error: error.message });
            break;
        case ErrorCodes.USER_CREATION_FAILED:
            res.status(500).send({ status: 'error', error: error.message });
            break;
        case ErrorCodes.USER_UPDATE_FAILED:
            res.status(500).send({ status: 'error', error: error.message });
            break;
        case ErrorCodes.USER_DELETION_FAILED:
            res.status(500).send({ status: 'error', error: error.message });
            break;
        case ErrorCodes.USER_AUTHENTICATION_FAILED:
            res.status(401).send({ status: 'error', error: error.message });
            break;

        default:
            console.log(error);
            res.status(500).send({ status: 'error', error: 'Uknown' });
    }

    return error;
}

const errorMessageFormat = (req, error) => {
    req.logger.error(error.name)
    req.logger.info(`${error.cause}`)
    req.logger.http(`Endpoint: ${req.url}`)
}

// const errorMessageFormat = (error) => {
//     console.log('\n\n-- Error: ' + error.name + ' ' + '----------'.repeat(3));
//     console.log(error.cause);
//     console.log('----------'.repeat(6) + '\n\n');
// }

module.exports = { errorHandler };