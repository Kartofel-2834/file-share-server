// Node
import fs from 'fs/promises';
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
        this.bindRoute({
            url: '/:id',
            method: 'GET',
            location: 'files/:id - GET',
            listener: (req, res) => this.getFile(req, res),
            middlewares: [
                roleAccessMiddleware(['admin', 'moderator', 'user']),
            ],
        });

        this.bindRoute({
            url: '/',
            method: 'GET',
            location: 'files - GET',
            listener: (req, res) => this.getFilesList(req, res),
            middlewares: [
                roleAccessMiddleware(['admin', 'moderator', 'user']),
            ],
        });

        this.bindRoute({
            url: '/',
            method: 'POST',
            location: 'files - POST',
            listener: (req, res) => this.addFile(req, res),
            middlewares: [
                filesMiddleware('file'),
                roleAccessMiddleware(['admin', 'moderator']),
            ],
        });

        this.bindRoute({
            url: '/',
            method: 'DELETE',
            location: 'files - DELETE',
            listener: (req, res) => this.deleteFilesList(req, res),
            middlewares: [
                roleAccessMiddleware(['admin', 'moderator']),
            ],
        });

        this.bindRoute({
            url: '/:id',
            method: 'DELETE',
            location: 'files/:id - DELETE',
            listener: (req, res) => this.deleteFile(req, res),
            middlewares: [
                roleAccessMiddleware(['admin', 'moderator']),
            ],
        });
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
    async deleteFilesList(req, res) {
        const filesIds = req.body?.ids || [];
        const { id: userId, role } = req?.tokenData || {};

        if (!filesIds?.length || !Array.isArray(filesIds)) {
            return res.status(400).json({
                message: 'Request error: ids list must be provided',
            });
        }

        const ownerId = role === 'admin' ? null : userId;
        const deletedFiles = await filesTable.deleteFiles(filesIds, ownerId);

        let filesDeletePromises = Array.isArray(deletedFiles) ? deletedFiles : [];
        filesDeletePromises = deletedFiles.filter(file => file.path).map(file => fs.unlink(file.path));

        // eslint-disable-next-line
        await Promise.all(filesDeletePromises);

        res.status(200).json(deletedFiles);
    }

    // Удалить файл по id
    async deleteFile(req, res) {
        const fileId = this.checkIdParam(req, res);
        const { id: userId, role } = req?.tokenData || {};

        if (!fileId) {
            return;
        }

        const ownerId = role === 'admin' ? null : userId;
        const [deletedFile] = await filesTable.deleteFiles([fileId], ownerId);
        
        if (!deletedFile || !deletedFile?.path) {
            return res.status(400).json({
                message: 'Request error: no file for delete',
                result: null,
            });
        }

        await fs.unlink(deletedFile.path);

        res.status(200).json(deletedFile);
    }
}

export default new FilesRouter().router;
