// Libraries
import bcrypt from 'bcryptjs';

// Utils
import { validate } from '#utils/validateUtils.js';

// Logger
import logger from '#logger/index.js';

// Database Queries
import usersQueries from '#database/queries/usersQueries.js';

// Database Managers
import TableManager from '#database/tableManager.js';

const validateRules = {
    login: ['required', 'login'],
    password: ['required'],
    email: ['email'],
    role: ['required', 'role'],
    name: ['required', 'name'],
    surname: ['required', 'name'],
};

function dropError(errors) {
    return {
        result: null,
        errors,
    };
}

class UsersTableManager extends TableManager {
    constructor() {
        super('users', usersQueries, validateRules);
    }

    async createUser(user = {}) {
        const passwordError = this._checkPassword(user?.password);
        const loginError = await this._checkLogin(user?.login);
        
        if (loginError || passwordError) {
            return loginError || passwordError;
        }

        const updatedUser = this._prepareUserPayload(user);
        const createdData = await this.add(updatedUser);
        
        if (createdData?.result) {
            const message = `created user ${user?.name} ${user?.surname} as ${user?.role}`;    
            logger.log(message, 'usersTable/createUser');
        }

        return createdData;
    }

    async setVerificationCode(adminId, code) {
        const user = await this.getById(adminId);

        if (!user) {
            return dropError({
                id: 'Пользователь с таким id не существует',
            }); 
        }

        if (user?.role !== 'admin') {
            return dropError({
                role: 'Отказано в доступе. Код восстановления доступен только администраторам',
            });
        }

        const result = await this.updateById(adminId, {
            email_code: code,
        });
        
        return result;
    }

    async setAdminPassword(adminId, newPassword) {
        const user = await this.getById(adminId);
        const isAdmin = user?.role === 'admin';

        if (!user) {
            return dropError({
                id: 'Пользователь с таким id не существует',
            }); 
        }

        if (!isAdmin) {
            return dropError({
                role: 'Отказано в доступе. Восстановление пароля доступно только администраторам',
            });
        }

        const result = await this.updateById(adminId, {
            password: this._hashPassword(newPassword),
        });

        return result;
    }

    async updateUser(userId, payload = {}, userPassword = null) {
        const user = await this.getById(userId);

        if (!user) {
            return {
                result: null,
                errors: {
                    id: 'Пользователь с таким id не существует',
                },
            };
        }

        let loginError;
        let passwordError;

        // Проверяем валидность пароля и уникальность логина, если они предосталвены
        if (payload?.login) {
            loginError = await this._checkLogin(payload.login);
        }

        if (payload?.password) {
            passwordError = this._checkPassword(payload.password);
        }

        if (loginError || passwordError) {
            return loginError || passwordError;
        }

        const isAdmin = user.role === 'admin';
        const isPasswordValid = bcrypt.compareSync(userPassword || '', user.password);

        if (isAdmin && !isPasswordValid) {
            return {
                result: null,
                errors: {
                    password: 'Отказано в доступе, неверный пароль',
                },
            };
        }

        const updatedPayload = this._prepareUserPayload(payload, isAdmin);
        const result = await this.updateById(userId, updatedPayload);
        
        return result;
    }

    async deleteUsers(usersIdsList = []) {
        const deletedUsers = await this.deleteByIdsList(usersIdsList);

        if (!Array.isArray(deletedUsers)) {
            return deletedUsers;
        }

        for (const user of deletedUsers) {
            logger.log(`deleted user ${user?.name} ${user?.surname}`, 'usersTable/deleteUsers');
        }

        return deletedUsers;
    }

    async getUserByLogin(login) {
        const [user] = await this.select('*', { where: 'login=$1' }, [login]);

        if (!user || !user?.id) {
            return {
                result: null,
                errors: {
                    login: 'Пользователь с таким логином не существует',
                },
            };
        }

        return {
            result: user,
            errors: null,
        };
    }

    // Проверка валидности пароля
    _checkPassword(password) {
        const error = validate(password || '', ['required']);
        
        if (!error) {
            return null;
        }

        return {
            errors: { password: error },
            result: null,
        };
    }

    // Проверка уникальности логина
    async _checkLogin(login) {
        const { result: user } = await this.getUserByLogin(login);

        if (!user?.id) {
            return null;
        }

        return {
            errors: { login: 'Пользователь с таким логином уже существует' },
            result: null,
        };
    }

    // Хэширование пароля пользователя перед вставкой в бд
    _hashPassword(notHashedPassword) {
        return bcrypt.hashSync(notHashedPassword || '', 6);
    }

    _prepareUserPayload(payload = {}, isAdmin = false) {
        const result = { ...payload };

        if (isAdmin) {
            delete result?.password;
            delete result?.email_code;
            delete result?.role;
        } else if (result?.password?.length) {
            result.password = this._hashPassword(result.password);
        }

        delete result.id;

        return result;
    }
}

export default new UsersTableManager();
