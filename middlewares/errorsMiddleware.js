// Logger
import logger from '#logger/index.js';

export default function errorsMiddleware(err, req, res, next) {
    const { url, method } = req;

    logger.error(`Server error: ${err}`, `errorsMiddleware - ${url} - ${method}`);
    
    res.status(500).json({
        message: `Server error: ${err}`,
    });
}
