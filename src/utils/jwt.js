const jwt = require('jsonwebtoken')
const jwt_secret = process.env.JWT_SECRET;

const generateToken = user => {
    const token = jwt.sign({ user }, jwt_secret, { expiresIn: '24h' })
    return token
}
module.exports = {
    generateToken,
    jwt_secret
}