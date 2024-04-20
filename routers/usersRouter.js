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
        this.router.get('/', this.requestListenerWrapper({
            location: 'users - GET',
            action: (req, res) => this.getUsers(req, res),
        }));

        this.router.get('/:id', this.requestListenerWrapper({
            location: 'users/:id - GET',
            action: this.getUserById,
        }));

        this.router.post('/', this.requestListenerWrapper({
            location: 'users - POST',
            action: this.createUser,
        }));

        this.router.delete('/', this.requestListenerWrapper({
            location: 'users - DELETE',
            action: this.deleteUsers,
        }));

        this.router.delete('/:id', this.requestListenerWrapper({
            location: 'users/:id - DELETE',
            action: this.deleteUserById,
        }));
        
        this.router.patch('/:id', this.requestListenerWrapper({
            location: 'users/:id - PATCH',
            action: this.updateUser,
        }));
    }

    // Получение пользователей
    async getUsers(req, res) {
        const { filters, values } = this.getFilters(req, usersSchema);

        const result = await usersTable.select('*', filters || {}, values || []);

        res.status(200).json(result);
    }

    // Получение одного пользователя по его id
    async getUserById(req, res) {
        const userId = req.params?.id;

        if (isNaN(userId)) {
            return res.status(400).send({
                message: 'Request error: invalid id',
            });
        }

        const user = await usersTable.getById(userId);

        if (!user) {
            return res.status(404).send({
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
        const userId = req.params?.id;

        if (isNaN(userId)) {
            return res.status(400).send({
                message: 'Request error: invalid id',
            });
        }

        const { result, errors } = await usersTable.updateUser(userId, req.body);
    
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
            return res.status(400).send({
                message: 'Request error: ids list not provided',
            });
        }

        const deletedUsers = await usersTable.deleteUsers(usersIds);
        res.status(200).json(deletedUsers);
    }

    // Удаление одного пользователя по его id
    async deleteUserById(req, res) {
        const userId = req.params?.id;

        if (isNaN(userId)) {
            return res.status(400).send({
                message: 'Request error: invalid id',
            });
        }

        const [deletedUser] = await usersTable.deleteUsers([userId]);

        if (!deletedUser) {
            return res.status(404).send({
                message: 'Request error: user with that id not found',
            });
        }

        res.status(200).json(deletedUser);
    }
}

export default new UsersRouter().router;
