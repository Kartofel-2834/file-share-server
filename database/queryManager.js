// Utils
import { getFieldsList } from '#utils/commonUtils.js';
import {
    getValuesMarkers,
    getSetMarkers,
    getTableSchema,
    convertQueryParts,
} from '#utils/dbUtils.js';

/**
 * IForeignKey {
 *    reference: string,
 *    action: string,
 * }
 * 
 * Конструктор QueryManager:
 *  name (String) - название таблицы
 *  
 *  schema (Object<string>) - схема полей таблицы
 *      пример: { id: 'SERIAL PRIMARY KEY' }
 *  
 *  foreignKeys (Object<IForeignKey>) - объект с связанными ключами таблицы
 *      пример: {
 *          owner_id: {
 *              reference: 'users(id)',
 *              action: 'ON DELETE SET NULL',
 *          }
 *      }
*/
export default class QueryManager {
    constructor(name, schema, foreignKeys = {}) {
        this.name = name;
        this.schema = schema;
        this.foreignKeys = foreignKeys;

        const convertedSchema = getTableSchema(this.schema, this.foreignKeys);
        
        if (!convertedSchema?.length) {
            return;
        }

        this.createTable = `CREATE TABLE IF NOT EXISTS ${this.name} (${convertedSchema})`;
    }

    insert(fields, queryParts = { returning: '*' }) {
        const fieldsArray = getFieldsList(fields ?? this.schema);
        const values = getValuesMarkers(fieldsArray);
        const additionalQuery = convertQueryParts(queryParts);

        if (!fieldsArray.length) {
            return null;
        }

        return `
            INSERT INTO ${this.name} (${fieldsArray.join(', ')})
            VALUES (${values.join(', ')})
            ${additionalQuery}
        `;
    }

    update(fields, queryParts = { returning: '*' }) {
        const schemaFields = getFieldsList(this.schema);

        let fieldsArray = getFieldsList(fields ?? this.schema);
        fieldsArray = fieldsArray.filter(field => schemaFields.includes(field));

        if (!fieldsArray.length) {
            return null;
        }

        const updateValues = getSetMarkers(fieldsArray);
        const additionalQuery = convertQueryParts(queryParts);

        return `
            UPDATE ${this.name}
            SET ${updateValues.join(', ')}
            ${additionalQuery}
        `;
    }

    delete(queryParts = { returning: '*' }) {
        const additionalQuery = convertQueryParts(queryParts);

        return `DELETE FROM ${this.name} ${additionalQuery}`;
    }

    select(selection = '*', queryParts = {}) {
        const additionalQuery = convertQueryParts(queryParts);

        return `SELECT ${selection} FROM ${this.name} ${additionalQuery}`;
    }
}
