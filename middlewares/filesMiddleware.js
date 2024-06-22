// Node
import path from 'path';

// Libraries
import multer from 'multer';

// Constants
import { rootDir } from '#constants.cjs';

const uploadPath = path.join(rootDir, 'uploads');

const storage = multer.diskStorage({
    destination(req, file, callback) {
        callback(null, uploadPath);
    },

    filename(req, file, callback) {
        const fileName = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileExtension = path.extname(file.originalname);

        callback(null, fileName + fileExtension);
    },
});

const limits = { fileSize: 24 * 1024 * 1024 };

const fileHandler = multer({ storage, limits });
  
export default function filesMiddleware(fileField = 'file') {
    return fileHandler.single(fileField);
}
