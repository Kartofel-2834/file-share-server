// Logger
import logger from '#logger/index.js';

// Database
import db from '#database/db.js';

// Utils
import { objectValidate, getPartialRulesForObject } from '#utils/validateUtils.js';
import { extractValuesArray, getValuesMarkers } from '#utils/dbUtils.js';

/**
 * Конструктор TableManager:
 *  tableName (String) - название таблицы
 *  
 *  queriesManager (QueryManager) - менеджер формирующий SQL запросы
 *  
 *  validateRules (Object<Array<string>>) -
 *      инструкция по валидации полей перед созданием записи в бд
 *      пример: {
 *          login: ['required', 'login'],
 *          password: ['required', 'password'],
 *      }
*/

const returningQuery = { returning: '*' };

export default class TableManager {
    constructor(tableName, queriesManager, validateRules = {}) {
        this.$query = queriesManager;
        this.tableName = tableName;
        this.validateRules = validateRules;
    }

    // Создание таблицы
    async init() {
        const onError = this._queryCheck('createTable', 'table creation failed', 'init');
        
        try {
            const result = await db.query(this.$query.createTable);

            logger.log(`created ${this.tableName} table`, `${this.tableName}Table/init`);
            return result;
        } catch (err) {
            onError(err);
            throw err;
        }
    }

    // Добавление записи в таблицу
    async add(payload = {}, queryParts = returningQuery) {
        const onError = this._queryCheck('insert', 'row insert failed', 'add');

        const insertion = { ...(this.$query.schema || this.validateRules) };
        delete insertion.id;

        try {
            const insertCommand = this.$query.insert(insertion, queryParts);
            const result = await this._validateDbRequest(insertCommand, payload, this.validateRules);

            return result;
        } catch (err) {
            onError(err);
            throw err;
        }
    }

    // Обновление полей существующей записи
    async update(payload = {}, queryParts = returningQuery) {
        const onError = this._queryCheck('update', 'row update failed', 'update');

        const partialRules = getPartialRulesForObject(payload, this.validateRules);

        try {
            const updateCommand = this.$query.update(payload, queryParts);
            const result = await this._validateDbRequest(updateCommand, payload, partialRules);
            
            return result;
        } catch (err) {
            onError(err);
            throw err;
        }
    }

    // Удаление записей из таблицы
    async delete(queryParts = returningQuery, values = []) {
        const onError = this._queryCheck('delete', 'row delete failed', 'delete');

        try {
            const command = this.$query.delete(queryParts);
            const result = await db.query(command, values);

            return Array.isArray(result?.rows) ? result.rows : [];
        } catch (err) {
            onError(err);
            throw err;
        }
    }

    // Получение записей из таблицы
    async select(selection = '*', queryParts = {}, values = []) {
        const onError = this._queryCheck('select', 'row select failed', 'select');
        
        try {
            const command = this.$query.select(selection, queryParts);
            const result = await db.query(command, values);

            return Array.isArray(result?.rows) ? result.rows : [];
        } catch (err) {
            onError(err);
            throw err;
        }
    }

    // Получение одной записи по id
    async getById(id, selection = '*', queryParts = {}) {
        const result = await this.select(selection, {
            where: 'id=$1',
            ...queryParts,
        }, [id]);

        return result?.[0] ?? null;
    }

    // Обновление одной записи по id
    async updateById(id, payload, queryParts = returningQuery) {
        const result = await this.update(payload, {
            where: `id=${id}`,
            ...queryParts,
        });

        result.result = result?.result?.[0] || null;

        return result;
    }

    // Удаление одной записи по id
    async deleteById(id, queryParts = returningQuery, values = []) {
        const queryValues = [id, ...values];

        const result = await this.delete({
            where: 'id=$1',
            ...queryParts,
        }, queryValues);

        return result?.[0] ?? null;
    }

    // Удаление множества пользователей по их id
    async deleteByIdsList(idsList = [], queryParts = returningQuery, values = []) {
        const queryValues = [...idsList, ...values];
        const markers = getValuesMarkers(idsList);
        
        const result = await this.delete({
            where: `id in (${markers.join(', ')})`,
            ...queryParts,
        }, queryValues);

        return result;
    }

    async _validateDbRequest(command, payload, validation) {
        const { isValid, errors } = objectValidate(payload, validation);
        
        if (!isValid || !command) {
            return {
                result: null,
                errors: command ? errors : 'Нет подходящих полей',
            };
        }

        const values = extractValuesArray(payload, this.$query.schema);
        let result = await db.query(command, values);
        result = Array.isArray(result?.rows) ? result.rows : [];

        return {
            result,
            errors: null,
        };
    }

    _queryCheck(queryName, message, placement) {
        const onError = err => {
            logger.error(`${this.tableName} ${message}: ${err}`, `tableManager/${placement}`);
        };


        if (this.$query?.[queryName]) {
            return onError;
        }

        const error = new Error(`${queryName} query not defined`);

        onError(error);
        throw error;
    }
}
