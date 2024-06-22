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
            placeholder: 'Название файла в системе',
        },
    },

    file: {
        type: 'file',
        validateOnInput: true,
        validate: file => {
            if (!(file instanceof File)) {
                return 'Пожалуйста, заполните это поле';
            }

            // 24 Mb
            const mb = 1024 * 1024;
            const fileSizeLimit = 24 * mb;
            const fileSizeInMb = Math.floor((file.size / mb) * 10) / 10;

            if (file.size >= fileSizeLimit) {
                return `Макс. размер файла 24мб (выбранный файл - ${fileSizeInMb}мб)`;
            }

            return '';
        },
    },
};
