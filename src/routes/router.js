const { Router } = require('express');
// TODO: CustomResponses & HandlePolices

class BaseRouter {
    constructor() {
        this.router = Router();
        this.init();
    };

    init() { };

    getRouter() { return this.router };

    get(path, ...callbacks) {
        this.router.get(path, this.customizeCallback(callbacks));
    };

    post(path, ...callbacks) {
        this.router.post(path, this.customizeCallback(callbacks));
    };

    put(path, ...callbacks) {
        this.router.put(path, this.customizeCallback(callbacks));
    };

    delte(path, ...callbacks) {
        this.router.delte(path, this.customizeCallback(callbacks));
    };

    customizeCallback(callbacks) {
        return callbacks.map((cb) => async (...params) => {
            await cb.apply(this, params);
        });
    };
};

module.exports = BaseRouter;