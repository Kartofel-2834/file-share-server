// Utils
import { strValidate } from '@/assets/utils/validate-utils.js';

export const loginField = {
    validate: value => strValidate(value, ['required']),
    attributes: {
        placeholder: 'Логин',
    },
};

export const passwordField = {
    type: 'password',
    validate: value => strValidate(value, ['required']),
    attributes: {
        placeholder: 'Пароль',
    },
};

// Login Fields
export const loginFormFields = {
    login: loginField,
    password: passwordField,
};

// Password Recovery Fields
export const recoveryFormFields = {
    login: loginField,

    new_password: {
        ...passwordField,
        attributes: {
            placeholder: 'Новый пароль',
        },
    },

    code: {
        type: 'code',
    },
};

// File add fields
export const fileAddFields = {
    name: {
        type: 'text',
        validate: value => strValidate(value, ['required']),
        attributes: {
            placeholder: 'Название файла',
        },
    },
};
