const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

const generateTokenJWT = (user, time = '24h') => {
    return jwt.sign(
        { user },
        JWT_SECRET,
        { expiresIn: time }
    );
}

const verifyTokenJWT = (req, res, next) => {
    const token = req.cookies.passToken;

    if (!token) {
        // TODO: CustomError - ErrorHandler
        console.log('Token expired');
        return res.json({ status: "error" });
    }

    jwt.verify(
        token,
        JWT_SECRET,
        (err, signedPayload) => {
            if (err) {
                //CustomError
                throw new Error(err);
            }

            req.passToken = {
                number: signedPayload.number,
                emial: signedPayload.emial
            };

            next();
        }
    );
}

// TODO: generatePassToken (Restablecer pwd)

module.exports = {
    generateTokenJWT,
    verifyTokenJWT
}


