const passport = require('passport');
const Router = require(`${__dirname}/router.js`);
const { PUBLIC } = require(`${__dirname}/../config/policies.constants.js`);

// TO-DO Mover a otra capa
const { getURL } = require(`${__dirname}/../utils/utils.js`);
const { generateToken } = require(`../utils/jwt.js`);

class SessionsRouter extends Router {
    init() {
        // JWT
        this.get('/current', [PUBLIC], passport.authenticate('jwt', { session: false }), (req, res) => {
            res.sendSuccess({ user: req.user });
        })

        // Local: Register 
        this.post('/register', [PUBLIC], passport.authenticate('register', { failureRedirect: './failregister' }),
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

                console.log(user);
                // Generamos un TOKEN JWT con {id, email, role}
                const credentials = { id: user._id.toString(), email: user.email, role: user.role } // jwt_payload
                const accessToken = generateToken(credentials)
                res.cookie('accessToken', accessToken, { maxAge: 60 * 1000, httpOnly: true });

                res.sendSuccess({ accessToken, redirect: `${getURL(req)}/api/sessions/current` });
            })

        this.get('/faillogin', [PUBLIC], (_, res) => {
            res.sendError(400, 'Login fail');
        })

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