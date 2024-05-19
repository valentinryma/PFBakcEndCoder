const jwt = require('jsonwebtoken')
const config = require(`${__dirname}/../dot_config.js`);

const { jwt_secret } = config;

const generateToken = user => {
    const token = jwt.sign({ user }, jwt_secret, { expiresIn: '24h' })
    return token
}
module.exports = {
    generateToken,
    jwt_secret
}