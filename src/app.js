require('./config.env.js');

const showInfo = require('./show_config.js');

const express = require('express');

const mongoose = require('mongoose');

const { serve, setup } = require('./docs/openapi.js');

const app = express();

app.use('/apidocs', serve, setup);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

const routes = [
    require('./routes/products.router.js')
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
