export function getFieldsList(fields = {}) {
    if (Array.isArray(fields)) {
        return fields;
    }

    if (!fields || typeof fields !== 'object') {
        return [];
    }

    return Object.keys(fields);
}

// Пример преобразования: { id: 1 } => ['id: 1']
export function convertObjectToStringArray(someObject = {}, separator = ': ') {
    return getFieldsList(someObject).map(field => `${field}${separator}${someObject?.[field]}`);
}

export function getObjectsIntersection(objectA = {}, objectB = {}) {
    return getFieldsList(objectA).reduce((result, field) => {
        if (!objectB?.[field]) {
            return result;
        }

        return {
            ...result,
            [field]: objectA[field],
        };
    }, {});
}

export function getRandom(min = 0, max = 10) {
    return Math.floor(Math.random() * (max - min) + min);
}

export function generateCode(length = 4) {
    let result = '';

    for (let i = 0; i < length; i++) {
        result += getRandom();
    }

    return result;
}
