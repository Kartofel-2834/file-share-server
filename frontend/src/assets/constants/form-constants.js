// Utils
import { strValidate } from '@/assets/utils/validate-utils.js';

export const loginFields = {
    login: {
        validate: value => strValidate(value, ['required', 'login']),
        attributes: {
            placeholder: 'Логин',
        },
    },

    password: {
        type: 'password',
        validate: value => strValidate(value, ['required', 'password']),
        attributes: {
            placeholder: 'Пароль',
        },
    },
};
