// Utils
import { getFieldsList } from '#utils/commonUtils.js';

const regex = {
    text: /^[0-9а-яё!?,.\-"'\s]+$/i,
    login: /^[a-z][a-z0-9]{4,}$/i,
    role: /^(user|admin|moderator)$/,
    actionType: /^(upload|download|view)$/,
    cyrillic: /^[а-яё\s]+$/i,
    latin: /^[a-z\s]+$/i,
    multilang: /^[а-яёa-z\s]+$/i,
    date: /^\d{2}\/\d{2}\/\d{4}$/,
    phone: /^\+7\s\([0-9]{3}\)\s[0-9]{3}-[0-9]{2}-[0-9]{2}$/,
    email: /^[a-z0-9./=?_-]{1,14}@[a-z0-9-]{1,14}\.[a-z0-9]{2,6}$/i,
    snils: /^[0-9]{3}-[0-9]{3}-[0-9]{3}\s[0-9]{2}$/,
    payment: /^[0-9]{4}\s[0-9]{4}\s[0-9]{4}\s[0-9]{4}$/,
    passport: /^[0-9]{4}\s[0-9]{6}$/,
    innCommercial: /^[0-9]{10}$/,
    inn: /^[0-9]{12}$/,
    pass: /^.*(?=.{12,})(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).*$/,
};

function test(value, reg, message = 'Неверный формат') {
    const testRegex = regex?.[reg] || reg;

    if (!(testRegex instanceof RegExp)) {
        return '';
    }

    return value !== '' && !value.match(testRegex) ? message : '';
}

const validators = {
    // Валидация обязательных полей
    required(value) {
        if (typeof value !== 'string') {
            return value ? '' : 'Обязательное поле';
        }

        const cleanValue = value?.replace(/\s/g, '');

        return cleanValue && cleanValue?.length ? '' : 'Обязательное поле';
    },

    // Валидация имени
    name(value) {
        if (value?.length < 2) {
            return 'Имя должно быть длиннее 2 символов';
        } else if (value?.length > 50) {
            return 'Имя может быть не длиннее 50 символов';
        }

        const updatedValue = `${value}`.split('-');

        if (updatedValue.includes('')) {
            return 'Неверный формат';
        }

        return test(updatedValue.join(''), regex.cyrillic);
    },

    // Валидация кириллицы
    cyrillic(value) {
        return test(value, regex.cyrillic, 'Используйте только кириллицу');
    },

    // Валидация текста
    text(value) {
        return test(value, regex.text, 'Используйте только кириллицу, цифры и спец. символы');
    },

    // Валидация пароля
    password(value) {
        if (value?.length > 64) {
            return 'Пароль не может быть длиннее 64 символов';
        }

        return test(value, regex.pass, 'Используйте надёжный пароль');
    },
};

export function validate(value, param = [], required = false) {
    let validateTypes = Array.isArray(param) ? [...param] : [param];
    validateTypes = validateTypes.filter(type => validators?.[type] || regex?.[type]);

    if (required) {
        validateTypes.unshift('required');
    }

    for (const validation of validateTypes) {
        const res = validators?.[validation]
            ? validators[validation](value)
            : test(value, regex[validation]);

        if (res) {
            return res;
        }
    }

    return '';
}

/**
 * Пример использования: objectValidate({ password: '123', name: 'Kamal' }, {
 *      password: ['required', 'password'],
 *      name: ['required', 'name'],
 * })
*/

export function objectValidate(someObject = {}, rules = {}) {
    const errors = {};
    let hasError = false;

    if (!someObject || typeof someObject !== 'object') {
        return {
            isValid: false,
            errors,
        }; 
    }

    for (const field in rules) {
        const value = someObject?.[field] || '';
        const error = validate(value, rules[field]);

        hasError = hasError || Boolean(error);

        if (error?.length) {
            errors[field] = error;
        }
    }

    return {
        isValid: !hasError,
        errors,
    };
}

// Возвращает объект с правилами только для тех полей,
// которые есть в someObject
export function getPartialRulesForObject(someObject = {}, rules = {}) {
    return getFieldsList(someObject).reduce((result, field) => {
        if (!rules?.[field]) {
            return result;
        }

        return {
            ...result,
            [field]: rules[field],
        };
    }, {});
}

export function stringifyErrors(errors = {}) {
    if (!errors || typeof errors !== 'object') {
        return '';
    }

    return Object.keys(errors)
        .map(field => `${field}: ${errors[field]}`)
        .join(', ');
}
