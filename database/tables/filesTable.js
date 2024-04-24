// Database Queries
import filesQueries from '#database/queries/filesQueries.js';

// Database Managers
import TableManager from '#database/tableManager.js';

// Logger
import logger from '#logger/index.js';

const validateRules = {
    name: ['required'],
};

class FilesTableManager extends TableManager {
    constructor() {
        super('files', filesQueries, validateRules);
    }

    async createFile(payload) {
        const result = await this.add(payload);
        
        if (!result?.errors) {
            logger.log(`File ${payload?.name} created`, 'filesTable/createFile');
        }

        return result;
    }

    async deleteFiles(filesIdsList = []) {
        const deletedFiles = await this.deleteByIdsList(filesIdsList);

        if (!Array.isArray(deletedFiles)) {
            return deletedFiles;
        }

        for (const file of deletedFiles) {
            logger.log(`deleted file ${file?.name}`, 'filesTable/deleteFiles');
        }

        return deletedFiles;
    }
}

export default new FilesTableManager();
