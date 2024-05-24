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

// Middlewares
import authMiddleware from '#middlewares/authMiddleware.js';

const jwtSecret = process.env.JWT_SECRET;


function prepareUserToSend(userData) {
    const updatedUser = { ...userData };

    delete updatedUser.password;
    delete updatedUser.email_code;
    delete updatedUser.email;

    return updatedUser;
}

class AuthRouter extends DefaultRouter {
    init() {
        // Биндинг листенеров
        this.bindRoute({
            url: '/me/',
            method: 'GET',
            location: 'auth/me - GET',
            listener: (req, res) => this.getUserInfo(req, res),
            middlewares: [authMiddleware],
        });

        this.bindRoute({
            url: '/login/',
            method: 'POST',
            location: 'auth/login - POST',
            listener: (req, res) => this.login(req, res),
        });

        this.bindRoute({
            url: '/email-verify/',
            method: 'POST',
            location: 'auth/email-verify - POST',
            listener: (req, res) => this.emailVerification(req, res),
        });

        this.bindRoute({
            url: '/password-recovery/',
            method: 'POST',
            location: 'auth/password-recovery - POST',
            listener: (req, res) => this.passwordRecovery(req, res),
        });
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
            user: prepareUserToSend(user),
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
                errors: {
                    code: 'Отсутствует код подтверждения',
                },
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

        const { result, errors } = await usersTable.setAdminPassword(user.id, new_password || '');

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
        const jwtCode = this._createJWT({ code }, { expiresIn: 900 });

        // Запись кода в базу данных
        const dbRes = await usersTable.setVerificationCode(user.id, jwtCode);

        if (!dbRes?.result?.email_code) {
            return res.status(500).json({
                message: 'Server error: code send failed',
                errors: dbRes?.errors,
            });
        }

        // Отпарвка сообщения с кодом на почту пользователя
        const mailRes = await mailer.send(user.email, {
            text: `Код подтверждения для восстановления пароля: ${code}`,
        });

        if (!mailRes || !mailRes?.isAccepted) {
            return res.status(500).json({
                message: 'Server error: code send failed',
                errors: {
                    email_code: 'Произошла ошибка при отправке письма на почту',
                },
            });
        }

        res.status(201).json(user);
    }

    // Получить информацию о пользователе по токену доступа
    async getUserInfo(req, res) {
        const { id: userId } = req.tokenData;

        if (!userId) {
            return;
        }

        const user = await usersTable.getById(userId);

        if (!user) {
            return res.status(404).json({
                message: 'Request error: user with that id not found',
            });
        }

        const updatedUser = prepareUserToSend(user);

        res.status(200).json(updatedUser);
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
