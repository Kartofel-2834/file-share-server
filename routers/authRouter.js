// Libraries
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Utils
import { generateCode } from '#utils/commonUtils.js';

// Database
import usersTable from '#database/tables/usersTable.js';

// Default router
import DefaultRouter from '#routers/defaultRouter.js';

// Mailer
import mailer from '#mailer/index.js';

const jwtSecret = process.env.JWT_SECRET;

class AuthRouter extends DefaultRouter {
    init() {
        // Биндинг листенеров
        this.router.post('/login/', this.requestListenerWrapper({
            location: 'auth/login - POST',
            action: (req, res) => this.login(req, res),
        }));

        this.router.post('/email-verify/', this.requestListenerWrapper({
            location: 'auth/email-verify - POST',
            action: (req, res) => this.emailVerification(req, res),
        }));

        this.router.post('/password-recovery/', this.requestListenerWrapper({
            location: 'auth/password-recovery - POST',
            action: (req, res) => this.passwordRecovery(req, res),
        }));
    }

    // Авторизация
    async login(req, res) {
        const { login, password } = req.body; 

        const { result: user, errors } = await usersTable.getUserByLogin(login);

        // Проверка логина
        if (errors) {
            return res.status(400).json({
                message: 'Request error: user with that login not exist',
                errors,
            });
        }

        const isPasswordValid = bcrypt.compareSync(password || '', user.password);

        // Проверка пароля
        if (!isPasswordValid) {
            return res.status(400).json({
                message: 'Request error: wrong password',
                errors: {
                    password: 'Неверный пароль',
                },
            });
        }

        res.status(202).json({
            token: this._createJWT({
                id: user.id,
                login: user.login,
                role: user.role,
            }),
        });
    }

    // Восстановление пароля
    async passwordRecovery(req, res) {
        const { login, code, new_password } = req.body;

        const { result: user, errors: loginErrors } = await usersTable.getUserByLogin(login);

        // Проверка логина
        if (!user?.id || loginErrors) {
            return res.status(400).json({
                message: 'Request error: user with that login not exist',
                errors: loginErrors,
            });
        }

        if (!code) {
            return res.status(400).json({
                message: 'Request error: code must be provided',
            });
        }

        const { code: savedCode } = jwt.verify(user.email_code, jwtSecret) || {};

        // Проверка валидности кода
        if (!savedCode || savedCode !== code) {
            return res.status(400).json({
                message: 'Request error: Wrong code',
                errors: {
                    message: savedCode ? 'Неверный код' : 'Код подтверждения не был выслан',
                },
            });
        }

        const { result, errors } = await usersTable.updateUser(user.id, {
            password: new_password || '',
            email_code: null,
        });

        if (errors) {
            return res.status(400).json({
                message: 'Request error: validation error',
                errors,
            });
        }

        res.status(200).json(result);
    }

    // Верификация почты отправкой сообщения с кодом
    async emailVerification(req, res) {
        const { login } = req.body;

        const { result: user, errors } = await usersTable.getUserByLogin(login);

        // Проверка логина
        if (!user?.id || errors) {
            return res.status(400).json({
                message: 'Request error: user with that login not exist',
                errors,
            });
        }

        // Проверка доступа восстановления пароля
        if (user.role !== 'admin' || !user.email?.length) {
            return res.status(403).json({
                message: 'Request error: access denied (for admins only)',
            });
        }

        const code = generateCode(4);

        // Запись кода в базу данных
        const dbUpdateRequest = usersTable.updateUser(user.id, {
            email_code: this._createJWT({ code }, { expiresIn: 900 }),
        });

        // Отпарвка сообщения с кодом на почту пользователя
        const mailSendRequest = mailer.send(user.email, {
            text: `Код подтверждения для восстановления пароля: ${code}`,
        });

        // eslint-disable-next-line
        const [dbRes, mailRes] = await Promise.all([dbUpdateRequest, mailSendRequest]);

        // Проверка успешности отправки письма
        if (!dbRes?.email_code || !mailRes || !mailRes?.isAccepted) {
            return res.status(500).json({
                message: 'Server error: code send failed',
            });
        }

        res.status(201).json(user);
    }

    // Создание JWT токена
    _createJWT(payload = {}, options = {}) {
        return jwt.sign(payload, jwtSecret, {
            expiresIn: '24h',
            ...options,
        });
    }
}

export default new AuthRouter().router;
