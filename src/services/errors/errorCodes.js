/**
 * Objeto que enumera los códigos de error comunes utilizados en una API de ecommerce.
 * @typedef {Object} ErrorCodes
 * @property {number} ROUTING_ERROR - Error en el enrutamiento.
 * @property {number} INVALID_TYPES_ERROR - Error de tipos inválidos.
 * @property {number} DATABASE_ERROR - Error de la base de datos.
 * @property {number} AUTHENTICATION_ERROR - Error de autenticación.
 * @property {number} AUTHORIZATION_ERROR - Error de autorización.
 * @property {number} VALIDATION_ERROR - Error de validación.
 * @property {number} PRODUCT_NOT_FOUND - Producto no encontrado.
 * @property {number} PRODUCT_ALREADY_EXISTS - El producto ya existe.
 * @property {number} PRODUCT_CREATION_FAILED - Fallo al crear el producto.
 * @property {number} PRODUCT_UPDATE_FAILED - Fallo al actualizar el producto.
 * @property {number} PRODUCT_DELETION_FAILED - Fallo al eliminar el producto.
 * @property {number} CART_NOT_FOUND - Carrito no encontrado.
 * @property {number} CART_CREATION_FAILED - Fallo al crear el carrito.
 * @property {number} CART_UPDATE_FAILED - Fallo al actualizar el carrito.
 * @property {number} CART_DELETION_FAILED - Fallo al eliminar el carrito.
 * @property {number} CART_ITEM_NOT_FOUND - Artículo del carrito no encontrado.
 * @property {number} CART_ITEM_ADD_FAILED - Fallo al agregar el artículo al carrito.
 * @property {number} CART_ITEM_REMOVE_FAILED - Fallo al eliminar el artículo del carrito.
 * @property {number} USER_NOT_FOUND - Usuario no encontrado.
 * @property {number} USER_ALREADY_EXISTS - El usuario ya existe.
 * @property {number} USER_CREATION_FAILED - Fallo al crear el usuario.
 * @property {number} USER_UPDATE_FAILED - Fallo al actualizar el usuario.
 * @property {number} USER_DELETION_FAILED - Fallo al eliminar el usuario.
 * @property {number} USER_AUTHENTICATION_FAILED - Fallo en la autenticación del usuario.
 */
const ErrorCodes = {
    // General errors
    ROUTING_ERROR: 1,
    INVALID_TYPES_ERROR: 2,
    DATABASE_ERROR: 3,
    AUTHENTICATION_ERROR: 4,
    AUTHORIZATION_ERROR: 5,
    VALIDATION_ERROR: 6,

    // Product errors
    PRODUCT_NOT_FOUND: 100,
    PRODUCT_ALREADY_EXISTS: 101,
    PRODUCT_CREATION_FAILED: 102,
    PRODUCT_UPDATE_FAILED: 103,
    PRODUCT_DELETION_FAILED: 104,

    // Cart errors
    CART_NOT_FOUND: 200,
    CART_CREATION_FAILED: 201,
    CART_UPDATE_FAILED: 202,
    CART_DELETION_FAILED: 203,
    CART_ITEM_NOT_FOUND: 204,
    CART_ITEM_ADD_FAILED: 205,
    CART_ITEM_REMOVE_FAILED: 206,

    // User errors
    USER_NOT_FOUND: 300,
    USER_ALREADY_EXISTS: 301,
    USER_CREATION_FAILED: 302,
    USER_UPDATE_FAILED: 303,
    USER_DELETION_FAILED: 304,
    USER_AUTHENTICATION_FAILED: 305,
};

module.exports = { ErrorCodes };
