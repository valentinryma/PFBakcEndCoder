/**
 *  El fin de este archivo, es desde un unico lugar obtenter una instancia de todos los repositorios
 *  (Se instancia sus correspondientes DTOs y DAOs).
 * 
 * No estoy muy seguro si es una buena practica, pero le da claridad al archivo viewController.
 * */

const repositories = require('./index.js');

const { FactoryDAO } = require('../factories/factoryDao.factory.js');

/**
 * Returns an instance of ProductRepository
 * 
 * @returns {ProductsRepository} an instance of ProductRepository
 */
const getProductRep = () => {
    const productDao = new FactoryDAO().getProductDao();

    return new repositories.product(productDao);
}

/**
 * Returns an instance of CartRepository
 * 
 * @returns {CartsRepository} an instance of CartRepository
 */
const getCartRep = () => {
    const cartDao = new FactoryDAO().getCartDao();

    return new repositories.cart(cartDao);
}

/**
 * An object containing instances of various repositories.
 *
 * @type {Object}
 * 
 * @property {ProductRepository} product - An instance of ProductRepository.
 * 
 * @property {CartRepository} cart - An instance of CartRepository.
 */
const getRepo = {
    product: getProductRep(),
    cart: getCartRep(),
}

/**
 * Returns an instance of ProductRepository
 * 
 * @returns {ProductsRepository} an instance of ProductRepository
 */

module.exports = getRepo