const passport = require('passport');

const User = require('../../dao/models/user.model');

const { initLocalStrategy, initJwtStrategy } = require('./strategies/index');

const initializeStrategies = () => {
    initJwtStrategy();

    initLocalStrategy();

    passport.serializeUser(
        (user, done) => {
            return done(null, user._id);
        }
    );

    passport.deserializeUser(
        async (id, done) => {
            const user = await User.findOne({ _id: id });

            return done(null, user);
        }
    );
}

module.exports = initializeStrategies;
