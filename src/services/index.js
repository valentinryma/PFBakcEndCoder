const { CartsRepository } = require('../services/carts.repository.js');

const { ProductsRepository } = require('../services/products.repository.js');

const { UsersRepository } = require('../services/users.repository.js');

// const { TicketsRepository } = require('../services/tickets.repository.js');

module.exports = {
    cart: CartsRepository,
    product: ProductsRepository,
    user: UsersRepository
}
