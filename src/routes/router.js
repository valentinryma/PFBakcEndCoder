// TODO: CustomErrors & HandlePolices
// TODO: LOGGEAARR responsess
const { Router } = require('express');

const jwt = require('jsonwebtoken');

const { PUBLIC, USER, ADMIN, PREMIUM } = require('./policies.constants.js');

class BaseRouter {
    constructor() {
        this.router = Router();

        this.init();
    }

    init() { }

    getRouter() {
        return this.router
    }

    get(path, policies, ...callbacks) {
        this.router.get(
            path,
            this.handlePolicies(policies),
            this.generateCustomResponses,
            this.customizeCallback(callbacks)
        );
    }

    post(path, policies, ...callbacks) {
        this.router.post(
            path,
            this.handlePolicies(policies),
            this.generateCustomResponses,
            this.customizeCallback(callbacks)
        );
    }

    put(path, policies, ...callbacks) {
        this.router.put(
            path,
            this.handlePolicies(policies),
            this.generateCustomResponses,
            this.customizeCallback(callbacks)
        );
    }

    patch(path, policies, ...callbacks) {
        this.router.patch(
            path,
            this.handlePolicies(policies),
            this.generateCustomResponses,
            this.customizeCallback(callbacks)
        );
    }

    delete(path, policies, ...callbacks) {
        this.router.delete(
            path,
            this.handlePolicies(policies),
            this.generateCustomResponses,
            this.customizeCallback(callbacks)
        );
    }

    /**
     * Middleware que maneja las políticas de autorización.
     *
     * @param {Array<string>} policies - Lista de políticas permitidas.
     * @returns {Function} Middleware que verifica la autorización del usuario.
     */
    handlePolicies(policies) {
        return (req, res, next) => {

            // Acceso sin autenticación, ruta pública.
            if (policies.includes(PUBLIC)) {
                return next();
            }

            // Verifica que el header de autorización del request.
            const headerAuth = req.cookies["accessToken"];

            if (!headerAuth) {
                return res
                    .status(401)
                    .send(
                        {
                            status: 'error',
                            error: 'Unauthorized'
                        }
                    );
            }

            // Obtiene y verifica el token JWT
            jwt.verify(
                headerAuth,
                process.env.JWT_SECRET,
                (err, payload) => {
                    if (err) {
                        return res
                            .status(403)
                            .send(
                                {
                                    status: 'error',
                                    error: 'Invalid token'
                                }
                            );
                    }

                    req.user = payload.user;
                }
            );

            const role = req.user.role.toUpperCase();

            if (!policies.includes(role)) {
                return res
                    .status(401)
                    .send(
                        {
                            status: 'error',
                            error: 'Unauthorized'
                        }
                    );
            }

            next();
        }
    }

    generateCustomResponses = (_, res, next) => {
        res.sendSuccessJSON = (payload) => {
            res.json({ status: "success", payload });
        }

        next();
    }

    customizeCallback(callbacks) {
        return callbacks.map(
            (cb) => {
                return async (...params) => {
                    try {
                        await cb.apply(this, params);
                    } catch (error) {
                        console.log(error);
                        //loggear res.status(500).send(error) con logger 
                    }
                }
            }
        );
    }
}

module.exports = BaseRouter;