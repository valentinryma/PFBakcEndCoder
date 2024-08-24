// Procces.ENV
require(`${__dirname}/dot_config.js`);
process.env?.PORT && console.log('- Variables de entorno cargadas: ✔');

const express = require('express');
const handlebars = require('express-handlebars');
const mongoose = require('mongoose');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const { serve, setup } = require('./docs/openapi.js');

const app = express();

// Logger
const { useLogger } = require(`${__dirname}/logger/logger.js`);

// Error Handler
const { errorHandler } = require(`./services/errors/errorHandler.js`);

// Passport Config.
const initializeStrategyJWT = require(`${__dirname}/config/passport-jwt.config.js`);
const initializeStrategyLocal = require(`${__dirname}/config/passport-local.config.js`);
const initializeStrategyGitHub = require(`${__dirname}/config/passport-github.config.js`);

// Sessions
const sessionMiddleware = require(`${__dirname}/sessions/mongoStorage.js`);

// Error Logger - winston
app.use(useLogger);

// Documentación
app.use('/apidocs', serve, setup);

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
initializeStrategyLocal();
initializeStrategyJWT();
initializeStrategyGitHub();

app.use(passport.initialize())
app.use(passport.session())

// Routers
const routes = [
    require(`${__dirname}/routes/products.router.js`),
    require(`${__dirname}/routes/sessions.router.js`),
    require(`${__dirname}/routes/carts.router.js`),
    require(`${__dirname}/routes/views.router.js`),
    require(`${__dirname}/routes/mocks.router.js`),
    require(`${__dirname}/routes/logger.router.js`),
    require(`${__dirname}/routes/users.router.js`),
];

for (const route of routes) {
    route.configure(app);
};

app.use(errorHandler);

const main = async () => {
    const persistence = process.env.PERSISTENCE || 'MONGO' // Default
    if (persistence === 'MONGO') {
        // Conexion DB
        const mongoUrl = process.env.MONGO_URL;
        const dbName = process.env.DB_NAME;

        await mongoose.connect(mongoUrl, { dbName })
    };

    // HTTP Server on.
    const PORT = process.env.PORT || 8080
    app.listen(PORT, () => {
        console.log(`- Sever on http://localhost:${PORT}`);
    });
};

main();