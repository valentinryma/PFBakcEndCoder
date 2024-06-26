const jwt = require('jsonwebtoken')
const jwt_secret = process.env.JWT_SECRET;

const { CustomError } = require(`../services/errors/CustomError.js`);
const { ErrorCodes } = require(`../services/errors/errorCodes.js`);

const generateToken = (user, time = '24h') => {
    const token = jwt.sign({ user }, jwt_secret, { expiresIn: time })
    return token
}

/**
 * Genera un token JWT para restablecer la contraseña.
 * 
 * Este método genera un token JWT que contiene un número aleatorio y una dirección de correo electrónico.
 * El token tiene una validez de 1 hora.
 * 
 * @param {number} number - Un número aleatorio que será parte del payload del token.
 * @param {string} email - La dirección de correo electrónico que será parte del payload del token.
 * @returns {string} El token JWT generado.
 */
const generatePassToken = (number, email) => {
    const token = jwt.sign({ number, email }, jwt_secret, { expiresIn: '1h' });
    return token;
}


const verifyPassToken = (req, res, next) => {
    const passwordToken = req.cookies.passToken;

    if (!passwordToken) {
        console.log('Token Expired, redirecting...')
        return res.redirect('/sendEmailToReset');
    }

    jwt.verify(passwordToken, jwt_secret, (err, signedPayload) => {
        if (err) {
            throw CustomError.createError({
                name: 'InvalidToken',
                cause: 'Invald Token',
                message: 'Error trying to restore password',
                code: ErrorCodes.AUTHENTICATION_ERROR
            })
        }

        req.passToken = { number: signedPayload.number, email: signedPayload.email };
        next();
    })
}

module.exports = {
    generateToken,
    generatePassToken,
    verifyPassToken,
    jwt_secret
}