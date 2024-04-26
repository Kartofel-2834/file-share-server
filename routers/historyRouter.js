// Default router
import DefaultRouter from '#routers/defaultRouter.js';

// Middlewares
import authMiddleware from '#middlewares/authMiddleware.js';
import roleAccessMiddleware from '#middlewares/roleAccessMiddleware.js';

// Database
import historyTable from '#database/tables/historyTable.js';
import { schema as historySchema } from '#database/queries/historyQueries.js';

class HistoryRouter extends DefaultRouter {
    init() {
        // Промежуточные обработки
        this.router.use([
            authMiddleware,
            roleAccessMiddleware(['admin']),
        ]);

        // Биндинг листенеров
        this.bindRoute({
            url: '/',
            method: 'GET',
            location: 'history - GET',
            listener: (req, res) => this.getHistoryList(req, res),
        });
    }

    // Получить историю действий пользователей
    async getHistoryList(req, res) {
        const { filters, values } = this.getFilters(req, historySchema);
    
        const result = await historyTable.select('*', filters || {}, values || []);
    
        res.status(200).json(result);
    }
}

export default new HistoryRouter().router;
