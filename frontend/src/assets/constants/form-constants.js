// Utils
import { strValidate } from '@/assets/utils/validate-utils.js';

export const loginFields = {
    login: {
        validate: value => strValidate(value, ['required']),
        attributes: {
            placeholder: 'Логин',
        },
    },

    password: {
        type: 'password',
        validate: value => strValidate(value, ['required']),
        attributes: {
            placeholder: 'Пароль',
        },
    },
};
