// Default router
import DefaultRouter from '#routers/defaultRouter.js';

// Middlewares
import filesMiddleware from '#middlewares/filesMiddleware.js';

class FilesRouter extends DefaultRouter {
    init() {
        // Биндинг листенеров
        this.router.post('/', filesMiddleware('file'), this.requestListenerWrapper({
            location: 'files - POST',
            action: this.addFile,
        }));
    }

    // Добавление файла
    addFile(req, res) {
        res.status(200).json(req.file);
    }
}

export default new FilesRouter().router;
