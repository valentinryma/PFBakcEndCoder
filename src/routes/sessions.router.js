const passport = require('passport');
const Router = require(`./router.js`);
const { PUBLIC } = require(`../config/policies.constants.js`);

const { getURL } = require(`../utils/utils.js`);
const { generateToken, verifyPassToken } = require(`../utils/jwt.js`);
const { UserDTO } = require('../dao/dtos/users.dto.js');

const { FactoryDAO } = require(`../dao/factory.js`);
const { UsersRepository } = require(`../services/users/users.repository.js`);
const { UsersController } = require(`../controllers/users.controller.js`)


/**
 * Función de ayuda para inyectar un controlador en un callback.
 * 
 * Esta función crea una instancia del DAO de usuario, el DTO de usuario, el repositorio de usuarios y el controlador de usuarios.
 * Luego, llama al callback proporcionado con el controlador, la solicitud y la respuesta como argumentos.
 * 
 * @function withController
 * @param {function} callback - La función callback que será llamada con el controlador, la solicitud y la respuesta.
 * @returns {function} Una función que toma `req` y `res` como argumentos y ejecuta el callback con el controlador, `req` y `res`.
 */
const withController = (callback) => {
    return (req, res) => {
        const dao = new FactoryDAO().getUserDao();
        const dto = UserDTO;

        const repository = new UsersRepository(dao, dto);
        const controller = new UsersController(repository);
        return callback(controller, req, res);
    }
}

class SessionsRouter extends Router {
    init() {
        // JWT
        this.get('/current', [PUBLIC], withController((controller, req, res) => controller.getByIdFormat(req, res)))

        // Local: Register 
        this.post('/register', [PUBLIC], (async (req, res, next) => {
            next();
        }), passport.authenticate('register', { failureRedirect: '/api/sessions/failregister' }),
            async (req, res) => {
                res.sendSuccess({ redirect: '/' });
            })

        this.get('/failregister', [PUBLIC], (_, res) => {
            res.sendError(400, 'Register fail');
        })

        // Local: Login
        this.post('/login', [PUBLIC], passport.authenticate('login', { failureRedirect: '/api/sessions/faillogin' }),
            async (req, res) => {
                const user = req.user;

                // Generamos un TOKEN JWT con {id, email, role}
                const credentials = { id: user._id.toString(), email: user.email, role: user.role } // jwt_payload
                const accessToken = generateToken(credentials)
                res.cookie('accessToken', accessToken, { maxAge: 60 * 1000, httpOnly: true });

                res.sendSuccess({ accessToken, redirect: `${getURL(req)}/api/sessions/current`, home: `${getURL(req)}/` });
            })

        this.get('/faillogin', [PUBLIC], (_, res) => {
            res.sendError(400, 'Login fail');
        })

        // Envia mail para restablecer pwd 
        this.post('/sendEmailResetPassword', [PUBLIC], withController((controller, req, res) => controller.sendEmailResetPassword(req, res)))

        // Restablece la password
        this.post('/resetPassword/:tid', [PUBLIC], verifyPassToken, withController((controller, req, res) => controller.resetPassword(req, res)))

        // Logout
        this.get('/logout', [PUBLIC], (req, res) => {
            req.session.destroy(_ => {
                res.redirect('/');
            })
        })

        // --------> GITHUB
        this.get('/github', [PUBLIC], passport.authenticate('github', { scope: ['user:email'] }), (req, res) => {
            res.redirect('/');
        });

        this.get('/githubcallback', [PUBLIC], passport.authenticate('github', { failureRedirect: '/' }), (req, res) => {
            res.redirect('/');
        });

        // --------> Path Status 
        this.get('/status', (req, res) => {
            res.send('ok');
        })
    }
}
module.exports = {
    configure: (app) => app.use('/api/sessions', new SessionsRouter().getRouter())
};