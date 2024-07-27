// TODO: Verificar try-catch - ErrorLogger

const passport = require('passport');

const { Strategy, ExtractJwt } = require('passport-jwt');

const cookieExtractor = req => req && req.cookies ? req.cookies['accessToken'] : null;

const initJwtStrategy = () => {
    passport.use(
        'current',

        new Strategy(
            {
                secretOrKey: process.env.JWT_SECRET,
                jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor])
            },
            async (jwt_payload, done) => {
                try {
                    return done(null, jwt_payload.user);

                } catch (error) {
                    console.log(error);

                    done(error)
                }
            }
        )
    );
}

module.exports = initJwtStrategy;