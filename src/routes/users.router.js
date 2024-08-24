const Router = require(`./router.js`);
const { ADMIN, PREMIUM, USER, PUBLIC } = require(`../config/policies.constants.js`);

const { UserDTO } = require('../dao/dtos/users.dto.js');

const { FactoryDAO } = require(`../dao/factory.js`);
const { UsersRepository } = require(`../services/users/users.repository.js`);
const { UsersController } = require(`../controllers/users.controller.js`)

const withController = (callback) => {
    return (req, res) => {
        const dao = new FactoryDAO().getUserDao();
        const dto = UserDTO;

        const repository = new UsersRepository(dao, dto);
        const controller = new UsersController(repository);
        return callback(controller, req, res);
    }
}

class UserRouter extends Router {
    // Extiende los atributos del padre. (Policies)
    constructor() {
        super();
    }

    init() {
        this.get('/premium/:id', [PUBLIC], withController((controller, req, res) => controller.turnPremiumRole(req, res)));
        this.get('/', [PUBLIC], withController((controller, req, res) => controller.getAll(req, res)));
    }
}

module.exports = {
    configure: (app) => app.use('/api/users', new UserRouter().getRouter())
}