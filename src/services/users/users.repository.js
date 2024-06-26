const { MailsService } = require(`../emails/mail.service.js`);

const { CustomError } = require(`../errors/CustomError.js`);
const { ErrorCodes } = require(`../errors/errorCodes.js`);

const { generatePassToken } = require('../../utils/jwt.js');
const { hashPwd, isValidPwd } = require('../../utils/hashing.js');
class UsersRepository {
    constructor(dao, dto) {
        this.dao = dao;
        this.dto = dto;
    }

    async getById(id) {
        return await this.dao.getById(id);
    }

    async getByIdFormat(id) {
        const result = await this.dao.getById(id);
        return await new this.dto(result);
    }

    // Envia un email con el link a un formulario unico para restablecer la contraseña.
    async sendEmailResetPassword(email) {
        if (!email) {
            throw CustomError.createError({
                name: 'InvalidUserData',
                cause: 'Invald User Data: email not found',
                message: 'Error trying to restore password',
                code: ErrorCodes.INVALID_TYPES_ERROR
            })
        }

        // Envia el Mail y Genera un numero aletorio que se utilizara como token: {number, email}
        const passToken = await new MailsService().sendMailResetPassword(email);

        // Token generado con {number, email} - expira en 1h.
        const passwordToken = generatePassToken(passToken.randomNumber, passToken.email);

        return passwordToken;
    }

    async resetPassword(tid, token, newPass, confirPass) {
        const { number, email } = token;

        if (tid != number) {
            throw CustomError.createError({
                name: 'InvalidTokenNumber',
                cause: 'Invald Token Number: Tid must be a Number',
                message: 'Error trying reset password',
                code: ErrorCodes.USER_AUTHENTICATION_FAILED
            })
        };

        if (!newPass || !confirPass) {
            throw CustomError.createError({
                name: 'InvalidData',
                cause: 'Faltan campos', // TODO: Estandarizar todos los mensjaes de Error.
                message: 'Error trying reset password',
                code: ErrorCodes.INVALID_TYPES_ERROR
            })
        }

        if (newPass !== confirPass) {
            throw CustomError.createError({
                name: 'InvalidConfirmPassword',
                cause: 'The password most be equals',
                message: 'Error trying reset password',
                code: ErrorCodes.USER_AUTHENTICATION_FAILED
            })
        }

        const user = await this.dao.getByEmail(email);

        if (!user) {
            throw CustomError.createError({
                name: 'UserNotFound',
                cause: 'User not found in DB',
                message: 'Error trying reset password',
                code: ErrorCodes.USER_NOT_FOUND
            })
        }

        if (isValidPwd(newPass, user.password)) {
            throw CustomError.createError({
                name: 'InvalidData',
                cause: 'The password cannot be the same as the previous one',
                message: 'Error trying reset password',
                code: ErrorCodes.INVALID_TYPES_ERROR
            })
        }

        await this.dao.resetPassword(email, hashPwd(newPass));
    }

    async turnPremiumRole(id) {
        return await this.dao.turnPremiumRole(id);
    }
}

module.exports = { UsersRepository }