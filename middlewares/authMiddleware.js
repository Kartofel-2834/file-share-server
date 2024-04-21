// Libraries
import jwt from 'jsonwebtoken';

// Logger
import logger from '#logger/index.js';

const jwtSecret = process.env.JWT_SECRET;

export default function authMiddleware(req, res, next) {
    if (req.method === 'OPTIONS') {
        return next();
    }

    const prohibitAccess = () => res.status(403).json({
        message: 'Request error: Access denied',
    });

    try {
        const token = req.headers?.authorization?.split(' ')?.[1];

        if (!token) {
            return prohibitAccess();
        }

        req.tokenData = jwt.verify(token, jwtSecret);
        next();
    } catch (err) {
        logger.error(err, 'authMiddleware');
        prohibitAccess();
    }
}
