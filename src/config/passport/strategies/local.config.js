// TODO: ErrorHandler, CustomError
// TODO: Ver si mover la logica de crear el carrito al crear un usario deberia ir en otro lado. (MVC o similar)

const passport = require('passport');

const { Strategy } = require('passport-local');

const User = require('../../../dao/models/user.model.js');

const Cart = require('../../../dao/models/cart.model.js');

const { hashPassword, validatePassword } = require('../../../utils/hash.js');

const initLocalStrategy = () => {
    passport.use(
        'register',
        new Strategy(
            { passReqToCallback: true, usernameField: 'email' },
            async (req, username, password, done) => {
                const { firstName, lastName, age, role } = req.body;

                try {
                    const user = await User.findOne({ email: username });

                    if (user) {
                        // No hay error, pero no se puede registart (Ya existe)
                        return done(null, false);
                    }

                    // Logica de Negocio: Al crear un usuario automaticamente se crea un carrito nuevo vacio 
                    // el cual le será asignado.
                    const newCart = await Cart.create({ products: [] })

                    const result = await User.create(
                        {
                            firstName,
                            lastName,
                            age: +age,
                            email: username,
                            password: hashPassword(password),
                            cart: newCart._id,
                            role: role || 'user'
                        }
                    );

                    done(null, result);
                } catch (error) {
                    console.log(error);

                    done(error);
                }
            }
        )
    );

    passport.use(
        'login',
        new Strategy(
            { usernameField: 'email' },
            async (username, password, done) => {
                try {
                    if (!username || !password) return done(null, false);

                    const user = await User.findOne({ email: username });

                    if (!user) {
                        return done(null, false);
                    }

                    if (!validatePassword(password, user.password)) {
                        return done(null, false);
                    }

                    done(null, user);
                } catch (err) {
                    done(err);
                }
            }
        )
    );
}

module.exports = initLocalStrategy;