// Libraries
import { Router } from 'express';

// Utils
import { getObjectsIntersection } from '#utils/commonUtils.js';
import { getSetMarkers } from '#utils/dbUtils.js';

// Logger
import logger from '#logger/index.js';

const allowedMethods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

export default class DefaultRouter {
    constructor() {
        this.router = new Router();

        this.init();
    }

    init() {
        this.router.get('/', (req, res) => res.send('hello'));
    }

    bindRoute(options = {}, noWrapper = false) {
        if (!allowedMethods.includes(options?.method)) {
            return logger.error('route bind failed: invalid method', 'DefaultRouter/bind');
        }

        if (typeof options?.listener !== 'function') {
            return logger.error('route bind failed: invalid listener', 'DefaultRouter/bind');
        }

        let { listener, method } = options;

        const url = options?.url || '/';
        const middlewares = options?.middlewares || [];

        const location = options?.location || `DefaultRouter/bind - ${method}`;
        const error = typeof options?.error === 'function' ? options.error : () => null; 
        
        if (!noWrapper) {
            listener = this.requestListenerWrapper({
                action: listener,
                location,
                error,
            });
        }

        method = method.toLowerCase();

        return this.router[method](url, middlewares, listener);
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
                res.status(500).json({ message });
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

    checkIdParam(req, res) {
        const id = req.params?.id;

        if (!isNaN(id)) {
            return id;
        }

        res.status(400).json({
            message: 'Request error: invalid id',
        });

        return null;
    }
}
