const Router = require(`${__dirname}/router.js`);
const { PUBLIC, USER, PREMIUM, ADMIN } = require(`${__dirname}/../config/policies.constants.js`);

const { verifyPassToken } = require(`../utils/jwt.js`);

const { CartsRepository } = require(`${__dirname}/../services/carts/carts.repository.js`);
const { ProductsRepository } = require(`${__dirname}/../services/products/products.repository.js`);
const { UsersRepository } = require(`${__dirname}/../services/users/users.repository.js`);
const { TicketsRepository } = require(`${__dirname}/../services/tickets/tickets.repository.js`);

const { FactoryDAO } = require(`${__dirname}/../dao/factory.js`);

const { TicketDTO } = require(`${__dirname}/../dao/dtos/tickets.dto.js`);

//! TEMPORAL! 
// (Se saltea la capa controller, directamente utiliza el repository para acceder al dao)
const getAccess = () => {

    const cartDao = new FactoryDAO().getCartDao();
    const productDao = new FactoryDAO().getProductDao();
    const userDao = new FactoryDAO().getUserDao();
    const ticketDao = new FactoryDAO().getTicketDao();

    const ticketDto = TicketDTO;

    const cartAccess = new CartsRepository(cartDao);
    const productAccess = new ProductsRepository(productDao);
    const usersAccess = new UsersRepository(userDao);
    const ticketsAccess = new TicketsRepository(ticketDao, ticketDto);

    return { cartAccess, productAccess, usersAccess, ticketsAccess }
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
            let cartId = null
            let total = 0;

            if (req.user) {
                isLoggedIn = true;
                cartId = req.user?.cart.toString();
            }

            if (cartId != null) {
                total = await cartAccess.getTotalProducts(cartId);
            }


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
                title: 'Register',
                styles: ['styles.css', 'log-in.css']
            })
        })

        this.get('/profile', [USER, PREMIUM, ADMIN], async (req, res) => {
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

        this.get('/carts', [USER, PREMIUM, ADMIN], async (req, res) => {
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

        this.get('/purchases', [USER, PREMIUM, ADMIN], async (req, res) => {
            const { ticketsAccess } = getAccess();
            const email = req.user?.email;

            const tickets = await ticketsAccess.getManyByEmail(email);

            res.render('purchases', {
                title: 'Purchases',
                styles: ['tickets.css'],
                tickets

            })
        })

        this.get('/sendEmailToReset', [PUBLIC], async (req, res) => {
            res.render('send_email_reset_pwd', {
                title: 'Reset Password',
                styles: ['styles.css', 'log-in.css'],

            })
        })

        this.get('/resetPassword/:tid', [PUBLIC], verifyPassToken, async (req, res) => {
            const tid = req.params.tid;
            const passwordToken = req.cookies.passToken;
            if (!passwordToken) {
                // error
            }

            res.render('reset_pwd', {
                title: 'Reset Password',
                styles: ['styles.css', 'log-in.css'],
                tid
            })
        })
    }
}

module.exports = {
    configure: (app) => app.use('/', new ViewsRouter().getRouter())
}