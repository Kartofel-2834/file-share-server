// Node
import path from 'path';

// Default router
import DefaultRouter from '#routers/defaultRouter.js';

// Middlewares
import filesMiddleware from '#middlewares/filesMiddleware.js';
import authMiddleware from '#middlewares/authMiddleware.js';
import roleAccessMiddleware from '#middlewares/roleAccessMiddleware.js';

// Database
import { schema as filesSchema } from '#database/queries/filesQueries.js';
import filesTable from '#database/tables/filesTable.js';

class FilesRouter extends DefaultRouter {
    init() {
        this.router.use(authMiddleware);

        // Биндинг листенеров
        this.router.get('/:id', [
            roleAccessMiddleware(['admin', 'moderator', 'user']),
        ], this.requestListenerWrapper({
            location: 'files/:id - GET',
            action: (req, res) => this.getFile(req, res),
        }));

        this.router.get('/', [
            roleAccessMiddleware(['admin', 'moderator', 'user']),
        ], this.requestListenerWrapper({
            location: 'files - GET',
            action: (req, res) => this.getFilesList(req, res),
        }));

        this.router.post('/', [
            filesMiddleware('file'),
            roleAccessMiddleware(['admin', 'moderator']),
        ], this.requestListenerWrapper({
            location: 'files - POST',
            action: this.addFile,
        }));

        this.router.delete('/', [
            roleAccessMiddleware(['admin', 'moderator']),
        ], this.requestListenerWrapper({
            location: 'files - DELETE',
            action: (req, res) => this.deleteFiles(req, res),
        }));
    }

    // Добавление файла
    async addFile(req, res) {
        if (!req.file || !req.body?.name) {
            return res.status(400).json({
                message: 'Request error: file and name must be provided',
            });
        }

        const { id } = req?.tokenData || {};
        const extenstion = path.extname(req.file.path);
        const { errors, result } = await filesTable.add({
            name: req.body.name,
            created_at: new Date(),
            size: req.file.size,   
            path: req.file.path,
            owner_id: id,
            extenstion,
        });

        if (errors) {
            return res.status(400).json({
                message: 'Request error: validation failed',
                errors,
            });
        } 

        res.status(200).json(result);
    }

    // Получить файл
    async getFile(req, res) {
        const fileId = this.checkIdParam(req, res);

        if (!fileId) {
            return;
        }

        const file = await filesTable.getById(fileId);

        if (!file) {
            return res.status(404).json({
                message: 'Request error: file with that id not found',
            });
        }

        res.status(200).json(file);
    }

    // Получить список файлов
    async getFilesList(req, res) {
        const { filters, values } = this.getFilters(req, filesSchema);

        const result = await filesTable.select('*', filters || {}, values || []);

        res.status(200).json(result);
    }

    // Удалить список файлов
    async deleteFiles(req, res) {
        const filesIds = req.body?.ids || [];

        if (!filesIds?.length || !Array.isArray(filesIds)) {
            return res.status(400).json({
                message: 'Request error: ids list must be provided',
            });
        }

        const deletedFiles = await filesTable.deleteFiles(filesIds);
        res.status(200).json(deletedFiles);
    }
}

export default new FilesRouter().router;
