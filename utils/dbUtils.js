// Utils
import { getFieldsList, convertObjectToStringArray } from '#utils/commonUtils.js';

// Извлечение значений полей из объекта в виде массива для использования в db.query
export function extractValuesArray(payload, fields = [], existOnly = false) {
    if (!payload || typeof payload !== 'object') {
        return [];
    }

    const fieldsList = getFieldsList(fields);

    if (!fieldsList?.length) {
        return [];
    }

    return fieldsList.map(field => payload?.[field]).filter(value => value);
}

/**
 * Пример преобразования:
 * getValuesMarkers(['name', 'surname']) => ['$1', '$2']
*/
export function getValuesMarkers(fields) {
    return getFieldsList(fields).map((field, index) => `$${index + 1}`);
}

/**
 * Пример преобразования:
 * getValuesMarkers(['name', 'surname']) => ['name=$1', 'surname=$2']
*/
export function getSetMarkers(fields) {
    return getFieldsList(fields).map((field, index) => `${field}=$${index + 1}`);
}

export function getTableSchema(schema = {}, foreignKeys = {}) {
    const schemaList = convertObjectToStringArray(schema, ' ');
    
    let foreignKeysList = getFieldsList(foreignKeys);
    foreignKeysList = foreignKeysList.filter(key => foreignKeys?.[key]?.reference);
    foreignKeysList = foreignKeysList.map(key => {
        const reference = foreignKeys[key].reference;
        const action = foreignKeys[key]?.action; 

        return `FOREIGN KEY (${key}) REFERENCES ${reference} ${action || ''}`;
    });

    return schemaList.concat(foreignKeysList).join(',\n');
}

/**
 * Пример преобразования:
 * convertQueryParts({ where: 'id=2' }) => `WHERE id=2`
*/
export function convertQueryParts(notParsedQuery) {
    const formatField = field => field.replaceAll('_', ' ').toUpperCase();
    const fields = getFieldsList(notParsedQuery).filter(field => notParsedQuery?.[field]);

    const result = fields.map(field => {
        const value = notParsedQuery[field];
        const formattedField = formatField(field);
        
        if (value === true) {
            return formattedField;
        }

        return `${formattedField} ${value}`;
    });

    return result.join(' ');
}
