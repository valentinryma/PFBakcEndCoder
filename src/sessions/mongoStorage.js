const MongoStore = require('connect-mongo')
const session = require('express-session')

const storage = MongoStore.create({
    dbName: process.env.DB_NAME,
    mongoUrl: process.env.MONGO_URL,
    ttl: process.env.TTL || 60 * 1000
})

module.exports = session({
    store: storage,
    secret: process.env.SECRET,
    resave: process.env.RESAVE,
    saveUninitialized: process.env.SAVE_UNITIALIZED,
})