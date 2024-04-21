// Libraries
import { Router } from 'express';

// Utils
import { getObjectsIntersection } from '#utils/commonUtils.js';
import { getSetMarkers } from '#utils/dbUtils.js';

// Logger
import logger from '#logger/index.js';

export default class DefaultRouter {
    constructor() {
        this.router = new Router();

        this.init();
    }

    init() {
        this.router.get('/', (req, res) => res.send('hello'));
    }

    // Дефолтная обертка для обработчиков поступающих запросов
    requestListenerWrapper({
        action = () => null,
        error = () => null,
        location = '',
    }) {
        return async (req, res) => {
            try {
                await action(req, res);
            } catch (err) {
                const message = `Server error: ${err}`;
                
                if (typeof error === 'function') {
                    error(message);
                }

                logger.error(err, location || 'DefaultRouter/requestListenerWrapper');
                res.status(500).json(message);
            }
        };
    }

    getFilters(req, tableSchema = null) {
        const filters = {};
        let values = [];

        // Фильтрация по полям записей в таблице
        if (typeof tableSchema === 'object' && tableSchema) {
            const filteredQuery = getObjectsIntersection(req.query, tableSchema);
            const markers = getSetMarkers(filteredQuery);
            values = Object.values(filteredQuery);

            filters.where = markers.join(' AND ');
        }

        const { limit, offset, order_by, sort_direction } = req?.query || {};

        // ORDER BY
        if (tableSchema && tableSchema?.[order_by]) {
            filters.order_by = order_by;
        }

        if (Number(sort_direction) === 0) {
            filters.desc = true;
        }

        // LIMIT
        if (!isNaN(limit)) {
            filters.limit = Number(limit);
        }

        // OFFSET
        if (!isNaN(offset)) {
            filters.offset = Number(offset);
        }

        return { filters, values };
    }
}
