const Router = require(`./router.js`);
const { PUBLIC } = require(`${__dirname}/../config/policies.constants.js`);

class MocksRouter extends Router {
    init() {
        this.get('/', [PUBLIC], (req, res) => {
            const { getURL } = require(`../utils/utils.js`);
            const links = {
                products: `${getURL(req)}/mocking/products`,
                users: 'to-do',
                carts: 'to-do',
            }
            res.json(links)
        })

        this.get('/products', [PUBLIC], (req, res) => {
            const { generateProducts } = require(`../mocks/products.mocks.js`);
            const { quantity } = req.query

            const products = generateProducts(quantity);
            res.json({ status: 'success', payload: products });
        })
    }
}

module.exports = {
    configure: (app) => app.use('/mocking', new MocksRouter().getRouter())
}