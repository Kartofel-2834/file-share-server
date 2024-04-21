// Default router
import DefaultRouter from '#routers/defaultRouter.js';

class HistoryRouter extends DefaultRouter {
    init() {
        // Биндинг листенеров
        this.router.get('/', (req, res) => res.send('hello'));
    }
}

export default new HistoryRouter().router;
