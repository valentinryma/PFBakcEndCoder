const Router = require(`${__dirname}/router.js`);
const { PUBLIC, USER } = require(`${__dirname}/../config/policies.constants.js`);

const { CartsRepository } = require(`${__dirname}/../services/carts.repository.js`);
const { ProductsRepository } = require(`${__dirname}/../services/products.repository.js`);
const { UsersRepository } = require(`${__dirname}/../services/users.repository.js`);

const { FactoryDAO } = require(`${__dirname}/../dao/factory.js`);

//! TEMPORAL!
const getAccess = () => {

    const cartDao = new FactoryDAO().getCartDao();
    const productDao = new FactoryDAO().getProductDao();
    const userDao = new FactoryDAO().getUserDao();

    const cartAccess = new CartsRepository(cartDao);
    const productAccess = new ProductsRepository(productDao);
    const usersAccess = new UsersRepository(userDao);

    return { cartAccess, productAccess, usersAccess }
}

class ViewsRouter extends Router {
    init() {
        this.get('/', [PUBLIC], async (req, res) => {
            // TEMPORAL!
            const { cartAccess, productAccess } = getAccess();

            const filters = req.query;
            const results = await productAccess.getAll(filters);

            // Verifica si el user esta logueado.
            let isLoggedIn = false;
            let cartId = 'null'

            if (req.user) {
                isLoggedIn = true;
                cartId = req.user?.cart.toString();
            }

            const total = await cartAccess.getTotalProducts(cartId);
            // No se si res.render, tendria que ir en un controller particular
            res.render('index', {
                title: 'Pagina Principal',
                scripts: ['products.js'],
                styles: ['styles.css'],
                results,
                isLoggedIn,
                isNotLoggedIn: !isLoggedIn,
                total,
                cartId
            })
        })

        this.get('/login', [PUBLIC], (req, res) => {
            res.render('log-in', {
                title: 'Login',
                styles: ['styles.css', 'log-in.css']
            })
        })

        this.get('/register', [PUBLIC], (req, res) => {
            res.render('register', {
                title: 'Register'
            })
        })

        // TODO
        this.get('/profile', [USER], async (req, res) => {
            const { usersAccess } = getAccess();
            const id = req.user.id
            const user = await usersAccess.getById(id);

            res.render('profile', {
                title: 'My profile',
                user: {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    age: user.age,
                    email: user.email
                }
            })
        })

        this.get('/carts', [USER], async (req, res) => {
            const { cartAccess } = getAccess();

            const id = (req.user.cart.toString());
            const cart = await cartAccess.getById(id);

            const calcTotal = (cart) => {
                let total = 0;

                for (const product of cart) {
                    total += product._id.price * product.quantity;
                }
                return total.toLocaleString()
            }
            const total = calcTotal(cart.products);

            res.render('cartId', {
                title: 'Cart Buy',
                scripts: ['carts.js'],
                styles: ['carts.css'],
                products: cart.products,
                total,
                cartId: id,
            })
        })
    }
}

module.exports = {
    configure: (app) => app.use('/', new ViewsRouter().getRouter())
}