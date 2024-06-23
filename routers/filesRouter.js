// Node
import fs from 'fs/promises';
import path from 'path';

// Libraries
import jwt from 'jsonwebtoken';

// Default router
import DefaultRouter from '#routers/defaultRouter.js';

// Middlewares
import filesMiddleware from '#middlewares/filesMiddleware.js';
import authMiddleware from '#middlewares/authMiddleware.js';
import roleAccessMiddleware from '#middlewares/roleAccessMiddleware.js';

// Database
import filesTable from '#database/tables/filesTable.js';
import historyTable from '#database/tables/historyTable.js';
import { schema as filesSchema } from '#database/queries/filesQueries.js';

// Enviroment
const jwtSecret = process.env.JWT_SECRET;

class FilesRouter extends DefaultRouter {
    init() {
        // Биндинг листенеров
        this.bindRoute({
            url: '/:id',
            method: 'GET',
            location: 'files/:id - GET',
            listener: (req, res) => this.getFile(req, res),
            middlewares: [authMiddleware],
        });

        this.bindRoute({
            url: '/',
            method: 'GET',
            location: 'files - GET',
            listener: (req, res) => this.getFilesList(req, res),
            middlewares: [authMiddleware],
        });

        this.bindRoute({
            url: '/',
            method: 'POST',
            location: 'files - POST',
            listener: (req, res) => this.addFile(req, res),
            middlewares: [
                authMiddleware,
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
                authMiddleware,
                roleAccessMiddleware(['admin', 'moderator']),
            ],
        });

        this.bindRoute({
            url: '/:id',
            method: 'DELETE',
            location: 'files/:id - DELETE',
            listener: (req, res) => this.deleteFile(req, res),
            middlewares: [
                authMiddleware,
                roleAccessMiddleware(['admin', 'moderator']),
            ],
        });

        this.bindRoute({
            url: '/:id/content',
            method: 'GET',
            location: 'files/:id/content - GET',
            listener: (req, res) => this.downloadFile(req, res),
        });

        this.bindRoute({
            url: '/:id/view',
            method: 'GET',
            location: 'files/:id/view - GET',
            listener: (req, res) => this.viewFile(req, res),
            middlewares: [authMiddleware],
        });
    }

    // Добавление файла
    async addFile(req, res) {
        if (!req.file || !req.body?.name) {
            return res.status(400).json({
                message: 'Request error: file and name must be provided',
                errors: {
                    file: 'Файл и его название должны быть предоставлены',
                },
            });
        }

        const { id: userId } = req?.tokenData || {};
        const extenstion = path.extname(req.file.path);
        
        const { errors, result } = await filesTable.add({
            name: req.body.name,
            size: req.file.size,   
            path: req.file.path,
            owner_id: userId,
            extenstion,
        });

        const createdFile = result?.[0];

        if (errors || !createdFile?.id) {
            return res.status(400).json({
                message: 'Request error: validation failed',
                errors,
            });
        } 

        await historyTable.add({
            type: 'upload',
            user_id: userId,
            file_id: createdFile.id,
        });

        res.status(200).json(createdFile);
    }

    // Получить файл
    async getFile(req, res) {
        const fileId = this.checkIdParam(req, res);

        if (!fileId) {
            return;
        }

        const file = await filesTable.getFileById(fileId);

        if (!file) {
            return res.status(404).json({
                message: 'Request error: file with that id not found',
            });
        }

        delete file?.path;

        res.status(200).json(file);
    }

    // Получить список файлов
    async getFilesList(req, res) {
        const { filters, values } = this.getFilters(req, filesSchema);

        let result = await filesTable.getFiles(filters, values);
        result = result.map(file => {
            const updatedFile = { ...file };
            delete updatedFile?.path;
            
            return updatedFile;
        });

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

    // Отправка файла для скачивания
    async downloadFile(req, res) {
        const fileId = this.checkIdParam(req, res);
        
        const token = req?.query?.token;
        const tokenData = jwt.verify(token, jwtSecret);

        if (!fileId) {
            return;
        }

        if (!tokenData?.id) {
            return res.status(403).json({
                message: 'Access denied',
                errors: {
                    file: 'Отказано в доступе',
                },
            });
        }

        const fileInfo = await filesTable.getById(fileId);
        
        const madeHistoryRecord = type => historyTable.add({
            type,
            user_id: tokenData?.id,
            file_id: fileId,
        });

        await madeHistoryRecord('download');
        await madeHistoryRecord('view');
    
        if (!fileInfo?.path) {
            return res.status(500).json({
                message: 'Server error: file path not found',
            });
        }

        res.status(200).sendFile(fileInfo.path);
    }

    // Просмотр файла
    async viewFile(req, res) {
        const fileId = this.checkIdParam(req, res);
        const { id: userId } = req?.tokenData || {};

        if (!fileId) {
            return;
        }

        await historyTable.add({
            type: 'view',
            user_id: userId,
            file_id: fileId,
        });

        res.status(200).json({
            message: 'Success, file view saved',
        });
    }
}

export default new FilesRouter().router;
