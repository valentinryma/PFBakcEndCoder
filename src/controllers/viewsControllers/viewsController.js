const getRepo = require('../../services/repository.service.js');

// Todo: isLoggedIn Middleware

class ViewController {
    async indexShow(req, res) {
        const products = await getRepo.product.getAll(req.query);

        // TODO terminar

        const params = {
            title: 'Home',
            scripts: ['products.js'],
            styles: ['main.css'],
            products: products.payload,
            isLoggedIn: true,
            cartId: '669ef32f059e135f5da140ad',
            useSweetAlert: true,
            useJquery: true,
        };

        return res.render('index', params);
    }

    /**
    * @type { import('express').RequestHandler }
    */
    async loginShow(req, res) {
        const params = {
            title: 'LogIn',
            scripts: [],
            styles: ['main.css'],
            // isLoggedIn: true, // Todo
        };

        return res.render('login', params);
    }

    // async showP11roducts(req, res) {
    //     const products = await getRepo.product.getAll();

    //     console.log(products)

    //     return res.send('ok');
    // }
}

module.exports = { ViewController };