const nodemailer = require('nodemailer');
class MailsService {
    constructor() { };

    /**
     * Envía un correo electrónico para restablecer la contraseña.
     * 
     * Este método envía un correo electrónico utilizando el servicio de Gmail, 
     * que contiene un enlace para restablecer la contraseña. El enlace incluye 
     * un número aleatorio que puede usarse como token para identificar la solicitud 
     * de restablecimiento.
     * 
     * @async
     * @param {string} email - La dirección de correo electrónico a la que se enviará el enlace de restablecimiento de contraseña.
     * @returns {Promise<Object>} Un objeto que contiene el número aleatorio generado y la dirección de correo electrónico proporcionada.
     */
    async sendMailResetPassword(email) {
        const transport = nodemailer.createTransport({
            service: 'gmail',
            port: 587,
            auth: {
                user: process.env.GMAIL_ACCOUNT,
                pass: process.env.GMAIL_PASSWORD,
            }
        });

        // Genera numero aleatorio (Será parte del Token)
        const randomNumber = Math.round(Math.random() * 500000);

        const link = `http://${process.env.HOST}:${process.env.PORT}/resetPassword/${randomNumber}`

        const message = `
        <div>
            <h1>Restablecer Contraseña</h1>
            <h2>test</h2>
            <p>Hola,</p>
            <p>Hemos recibido una solicitud para restablecer la contraseña de tu cuenta.</p>
            <p>Para restablecer tu contraseña, haz clic en el siguiente enlace: <a href="${link}">Restablecer Contraseña</a></p>
            <p>Si no solicitaste un cambio de contraseña, puedes ignorar este correo electrónico.</p>
            <p>Gracias.</p>
        </div>
        `

        // Envia el mail.
        await transport.sendMail({
            from: 'Server',
            to: email,
            html: message,
            subject: 'Reset your password'
        })

        return { randomNumber, email };
    }
}

module.exports = { MailsService };