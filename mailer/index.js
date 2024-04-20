// Libraries
import nodemailer from 'nodemailer';

// Logger
import logger from '#logger/index.cjs';

const appMail = process.env.MAIL_ACCOUNT;
const appPassword = process.env.MAIL_PASSWORD;

class Mailer {
    constructor() {
        this.mail = appMail;
        this.password = appPassword;
        this.transporter = null;

        this.init();
    }

    init() {
        try {
            this.transporter = nodemailer.createTransport({
                host: 'smtp.mail.ru',
                port: 465,
                secure: true,
                auth: {
                    user: this.mail,
                    pass: this.password,
                },
            });
        } catch (err) {
            logger.error(`mail transporter init err: ${err}`, 'mailer');
        }
    }

    async send(to, options = {}) {
        if (!this.transporter) {
            return logger.error('mail send failed: transporter not inited', 'mailer');
        }

        try {
            const result = await this.transporter.sendMail({
                from: this.mail,
                to,
                ...options,
            });

            return {
                isRejected: result?.rejected?.includes(to) || true,
                isAccepted: result?.accepted?.includes(to) || false,
                response: result,
            };
        } catch (err) {
            logger.error(`mail send failed: ${err}`, 'mailer');
            return null;
        }
    }
}

export default new Mailer();
