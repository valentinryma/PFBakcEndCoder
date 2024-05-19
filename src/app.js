const express = require('express');
const handlebars = require('express-handlebars');
const mongoose = require('mongoose');
const passport = require('passport');
const cookieParser = require('cookie-parser');

const config = require(`${__dirname}/dot_config.js`)

const app = express();

// Passport Config.
const initializeStrategyJWT = require(`${__dirname}/config/passport-jwt.config.js`);
const initializeStrategyLocal = require(`${__dirname}/config/passport-local.config.js`);
const initializeStrategyGitHub = require(`${__dirname}/config/passport-github.config.js`);

// Sessions
const sessionMiddleware = require(`${__dirname}/sessions/mongoStorage.js`);

// Handlebars Config.
app.engine('handlebars', handlebars.engine())
app.set('views', `${__dirname}/views`)
app.set('view engine', 'handlebars')

// Express Config.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Public
app.use(express.static(`${__dirname}/../public`));

// Mongo Session 
app.use(sessionMiddleware);

// Cookies
app.use(cookieParser());

// Passport - Strategys
initializeStrategyGitHub();
initializeStrategyLocal();
initializeStrategyJWT();

app.use(passport.initialize())
app.use(passport.session())

// Método de Persistencia - Storage
const { ProductsStorage } = require(`${__dirname}/dao/products.storage.js`)
const { CartsStorage } = require(`${__dirname}/dao/carts.storage.js`)
// const { UsersStorage } = require(`${__dirname}/dao/users.storage.js`)

// Instancias Storage (Globales - All request)
app.set('product.storage', new ProductsStorage());
app.set('cart.storage', new CartsStorage());
// app.set('user.storage', new UsersStorage());

// Routers
const routes = [
    require(`${__dirname}/routes/products.router.js`),
    require(`${__dirname}/routes/carts.router.js`),
    require(`${__dirname}/routes/views.router.js`),
    require(`${__dirname}/routes/sessions.router.js`),
];

for (const route of routes) {
    route.configure(app);
}

const main = async () => {
    // Conexion DB
    const { mongoUrl, dbName } = config
    await mongoose.connect(mongoUrl, { dbName })

    // HTTP Server on.
    const { PORT } = config || 8080
    app.listen(PORT, () => {
        console.log(`Sever on http://localhost:${PORT}/`);
    });
};

main();