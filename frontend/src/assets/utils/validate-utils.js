const regex = {
    text: /^[0-9а-яё!?,.\-"'\s]+$/i,
    cyrillic: /^[а-яё\s]+$/i,
    latin: /^[a-z\s]+$/i,
    login: /^[a-z][a-z0-9]{4,}$/i,
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
        console.warn('error validate-utils: regular expression is not found');
        return '';
    }

    return value !== '' && !value.match(testRegex) ? message : '';
}

const validators = {
    // Валидация обязательных полей
    required(value) {
        const cleanValue = value?.replace(/\s/g, '');

        return cleanValue && cleanValue?.length
            ? ''
            : 'Пожалуйста, заполните это поле';
    },

    // Валидация англ.\рус. слов
    letters(value) {
        const defaultMessage = 'Пожалуйста, используйте только буквы';

        if (!value) {
            return defaultMessage;
        }

        const reg = value.charAt(0).match(regex.cyrillic)
            ? regex.cyrillic
            : regex.latin;

        if (!value.match(reg) && value.match(regex.multilang)) {
            return 'Пожалуйста, используйте только одну языковую раскладку';
        }

        return test(value, reg, defaultMessage);
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
        return test(value, regex.pass, 'Используйте надёжный пароль');
    },

    // Валидация даты
    date(value) {
        const [day, month, year] = value?.split('/') || [];

        if (!day || !month || !year || test(value, regex.date)) {
            return 'Неверный формат даты';
        }

        if (day > 31) {
            return 'День не может быть больше 31';
        } else if (month > 12) {
            return 'Месяц не может быть больше 12';
        }

        return '';
    },
};

export function strValidate(value, param = []) {
    let validateTypes = Array.isArray(param) ? [...param] : [param];
    validateTypes = validateTypes.filter(type => validators?.[type] || regex?.[type]);

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
