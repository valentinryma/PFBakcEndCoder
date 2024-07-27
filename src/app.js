require('./config.env.js');

const showInfo = require('./show_config.js');

const express = require('express');

const mongoose = require('mongoose');

const { serve, setup } = require('./docs/openapi.js');

const app = express();

const passport = require('passport');

const cookieParser = require('cookie-parser');

// logger
// errorHandler

const initializeStrategies = require('./config/passport/passport.config.js')

const sessionMiddleware = require('./sessions/mongoStorage.js');

app.use('/apidocs', serve, setup);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(sessionMiddleware);

app.use(cookieParser());

initializeStrategies();

app.use(passport.initialize());

app.use(passport.session());

const routes = [
    require('./routes/products.router.js'),
    require('./routes/carts.router.js'),
    require('./routes/users.router.js'),
    require('./routes/sessions.router.js'),
];

routes.forEach(
    (route) => {
        route.configure(app);
    }
)

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
        console.log('Server ON');

        if (process.env.SHOW_INFO === 'true') showInfo();
    })
}

main();
