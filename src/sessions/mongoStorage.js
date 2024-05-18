const MongoStore = require('connect-mongo')
const session = require('express-session')
const config = require(`${__dirname}/../config.js`);

const { dbName, mongoUrl, secret, resave, saveUninitialized } = config

const storage = MongoStore.create({
    dbName,
    mongoUrl,
    // ttl: 60
})

module.exports = session({
    storage,
    secret,
    resave,
    saveUninitialized
})