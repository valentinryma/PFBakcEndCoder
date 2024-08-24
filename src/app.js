// Requires
require('./config.env.js');

const { join } = require('path');

const showInfo = require('./show_config.js');

const express = require('express');

const handlebars = require('express-handlebars');

const { serve, setup } = require('./docs/openapi');

const mongoose = require('mongoose');

const app = express();

const passport = require('passport');

const cookieParser = require('cookie-parser');

const initializeStrategies = require('./config/passport/passport.config.js')

const sessionMiddleware = require('./sessions/mongoStorage.js');

// logger

// Handlebars
app.engine('handlebars', handlebars.engine());

app.set('views', join(__dirname, 'views'));

app.set('view engine', 'handlebars');

// Api Docs
app.use('/apidocs', serve, setup);

// Expres config.
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(express.static(join(__dirname, '../public')));

// Sessions & Cookies
app.use(sessionMiddleware);

app.use(cookieParser());

initializeStrategies();

app.use(passport.initialize());

app.use(passport.session());

// Routing 

const routes = [
    require('./routes/products.router.js'),
    require('./routes/carts.router.js'),
    require('./routes/users.router.js'),
    require('./routes/sessions.router.js'),
    require('./routes/views.router.js'),
];

routes.forEach(
    (route) => {
        route.configure(app);
    }
);


// Main

const main = async () => {
    const PORT = process.env.PORT || 8080;

    if (process.env.PERSISTENCE === "MONGO_DB") {
        await mongoose.connect(
            process.env.MONGO_URL,
            { dbName: process.env.DB_NAME }
        );
    };

    app.listen(PORT, () => {
        // loggear
        if (process.env.SHOW_INFO === 'true') showInfo();

        console.log('Server ON');
    });
}

main();
