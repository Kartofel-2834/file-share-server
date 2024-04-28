// Database
import { schema as usersSchema } from '#database/queries/usersQueries.js';
import usersTable from '#database/tables/usersTable.js';

// Default router
import DefaultRouter from '#routers/defaultRouter.js';

// Middlewares
import authMiddleware from '#middlewares/authMiddleware.js';
import roleAccessMiddleware from '#middlewares/roleAccessMiddleware.js';

class UsersRouter extends DefaultRouter {
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
            location: 'users - GET',
            listener: (req, res) => this.getUsers(req, res),
        });

        this.bindRoute({
            url: '/:id',
            method: 'GET',
            location: 'users/:id - GET',
            listener: (req, res) => this.getUserById(req, res),
        });

        this.bindRoute({
            url: '/',
            method: 'POST',
            location: 'users - POST',
            listener: (req, res) => this.createUser(req, res),
        });

        this.bindRoute({
            url: '/',
            method: 'DELETE',
            location: 'users - DELETE',
            listener: (req, res) => this.deleteUsers(req, res),
        });

        this.bindRoute({
            url: '/:id',
            method: 'DELETE',
            location: 'users/:id - DELETE',
            listener: (req, res) => this.deleteUserById(req, res),
        });

        this.bindRoute({
            url: '/:id',
            method: 'PATCH',
            location: 'users/:id - PATCH',
            listener: (req, res) => this.updateUser(req, res),
        });
    }

    // Получение пользователей
    async getUsers(req, res) {
        const { filters, values } = this.getFilters(req, usersSchema);

        const result = await usersTable.select('*', filters || {}, values || []);

        res.status(200).json(result);
    }

    // Получение одного пользователя по его id
    async getUserById(req, res) {
        const userId = this.checkIdParam(req, res);

        if (!userId) {
            return;
        }

        const user = await usersTable.getById(userId);

        if (!user) {
            return res.status(404).json({
                message: 'Request error: user with that id not found',
            });
        }

        res.status(200).json(user);
    }

    // Создание пользователя
    async createUser(req, res) {
        // Запрещаем создание админа
        if (req.body?.role === 'admin') {
            return res.status(400).json({
                message: 'Request error: admin creation prohibited',
            });
        }

        const { result, errors } = await usersTable.createUser(req.body);
    
        if (errors) {
            return res.status(400).json({
                message: 'Request error: validation failed',
                errors,
            });
        }

        res.status(201).json(result);
    }

    // Обновление пользователя
    async updateUser(req, res) {
        const userId = this.checkIdParam(req, res);

        if (!userId) {
            return;
        }

        const { result, errors } = await usersTable.updateUser(userId, req.body, req.body?.password);
    
        if (errors) {
            return res.status(400).json({
                message: 'Request error: validation failed',
                errors,
            });
        }
    
        res.status(200).json(result);
    }

    // Удаление пользователей
    async deleteUsers(req, res) {
        const usersIds = req.body?.ids || [];

        if (!usersIds?.length || !Array.isArray(usersIds)) {
            return res.status(400).json({
                message: 'Request error: ids list must be provided',
            });
        }

        const deletedUsers = await usersTable.deleteUsers(usersIds);
        res.status(200).json(deletedUsers);
    }

    // Удаление одного пользователя по его id
    async deleteUserById(req, res) {
        const userId = this.checkIdParam(req, res);

        if (!userId) {
            return;
        }

        const [deletedUser] = await usersTable.deleteUsers([userId]);

        if (!deletedUser) {
            return res.status(404).json({
                message: 'Request error: user with that id not found',
            });
        }

        res.status(200).json(deletedUser);
    }
}

export default new UsersRouter().router;
