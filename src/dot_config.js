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
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL,

    // Mongo Storage
    secret: process.env.SECRET,
    resave: process.env.RESAVE,
    saveUninitialized: process.env.SAVE_UNITIALIZED,
    ttl: process.env.TTL,

    // JWT Config
    jwt_secret: process.env.JWT_SECRET
}