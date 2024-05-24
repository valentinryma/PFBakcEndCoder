const persistence = (process.env.PERSISTENCE || process.argv.PERSISTENCE) || 'MONGO' // Default

let ProductsDAO = null
let CartsDAO = null
let UsersDAO = null

if (persistence === 'MONGO') {
    console.log(`- Metodo de Persistencia: ${persistence}`)
    const { ProductsMongoDAO } = require(`${__dirname}/daos/mongo/products.dao.js`);
    const { CartsMongoDAO } = require(`${__dirname}/daos/mongo/carts.dao.js`);
    const { UsersMongoDAO } = require(`${__dirname}/daos/mongo/users.dao.js`);

    ProductsDAO = new ProductsMongoDAO();
    CartsDAO = new CartsMongoDAO();
    UsersDAO = new UsersMongoDAO();

} else if (persistence === 'FILE') {
    console.log(`- Metodo de Persistencia: ${persistence}`)
} else if (persistence === 'MEMORY') {
    console.log(`- Metodo de Persistencia: ${persistence}`)
} else {
    console.log(`- Metodo de Persistencia: ${persistence}`)
}

class FactoryDAO {
    constructor() {
        this.productDAO = ProductsDAO;
        this.cartDAO = CartsDAO;
        this.userDAO = UsersDAO;
    }

    getProductDao() { return this.productDAO }
    getCartDao() { return this.cartDAO }
    getUserDao() { return this.userDAO }
}

module.exports = { FactoryDAO }
