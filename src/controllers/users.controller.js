class UsersController {
    constructor(service) {
        this.service = service;
    }

    async getAll(_, res) {
        const users = await this.service.getAll();
        res.sendSuccess({ users });
    }

    async getById(req, res) {
        const uid = req.params.uid;
        const user = await this.service.getById(uid);
        res.sendSuccess({ user });
    }

    async getByIdFormat(req, res) {
        const id = req.user._id.toString();
        const user = await this.service.getByIdFormat(id);
        res.sendSuccess({ user });

    }

    async sendEmailResetPassword(req, res) {
        const email = req.body.email;
        const passwordToken = await this.service.sendEmailResetPassword(email);

        // Guardar Token en Cookie
        res.cookie('passToken', passwordToken, { maxAge: 60 * 60 * 1000, httpOnly: true });

        res.json({ message: 'mail enviado' });
    }


    async resetPassword(req, res) {
        const tid = req.params.tid;
        const token = req.passToken;

        const { password, confirmPassword } = req.body;

        await this.service.resetPassword(tid, token, password, confirmPassword);
        res.json({ message: 'Password change' });
    }

    async turnPremiumRole(req, res) {

        const id = req.params.id;
        const newRole = await this.service.turnPremiumRole(id);

        res.json({ status: 'success', newRole })

    }
}

module.exports = { UsersController };