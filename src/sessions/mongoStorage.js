const MongoStore = require('connect-mongo')
const session = require('express-session')
const config = require(`${__dirname}/../dot_config.js`);

const { dbName, mongoUrl, secret, resave, saveUninitialized, ttl } = config

const storage = MongoStore.create({
    dbName,
    mongoUrl,
    ttl
})

module.exports = session({
    store: storage,
    secret,
    resave,
    saveUninitialized
})