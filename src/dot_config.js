const dotenv = require('dotenv');
dotenv.config({
    path: './.env'
});

module.exports = {
    // Sv config
    env: process.env.ENV,
    PORT: process.env.PORT,

    // MongoDB
    mongoUrl: process.env.MONGO_URL,
    dbName: process.env.DB_NAME,

    // GitHub - Private
    app_id: process.env.APP_ID,
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    callback_url: process.env.CALLBACK_URL,

    // Mongo Storage
    secret: process.env.SECRET,
    resave: process.env.RESAVE,
    saveUninitialized: process.env.SAVE_UNITIALIZED,
}