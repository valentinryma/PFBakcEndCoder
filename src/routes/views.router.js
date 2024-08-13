const Router = require('./router');

const { USER, PUBLIC, ADMIN, PREMIUM } = require('./policies.constants.js');

const { ViewController } = require('../controllers/viewsControllers/viewsController.js');

const withController = (callback) => {
    return (req, res) => {
        return callback(new ViewController(), req, res);
    }
}

class ViewRouter extends Router {
    init() {
        this.get('/', [PUBLIC], withController((controller, req, res) => controller.indexShow(req, res)));

        this.get('/login', [PUBLIC], withController((controller, req, res) => controller.loginShow(req, res)));
    }
}

module.exports = {
    configure: (app) => app.use('/', new ViewRouter().getRouter())
};