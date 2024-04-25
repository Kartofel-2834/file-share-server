// Database Queries
import filesQueries from '#database/queries/filesQueries.js';

// Database Managers
import TableManager from '#database/tableManager.js';

// Logger
import logger from '#logger/index.js';

// Utils
import { getValuesMarkers } from '#utils/dbUtils.js';

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

    async deleteFiles(filesIdsList = [], userRole, userId) {
        if (!['moderator', 'admin'].includes(userRole)) {
            return {
                result: null,
                errors: {
                    role: 'Access denied',
                },
            };
        }

        const values = [...filesIdsList];
        const markers = getValuesMarkers(filesIdsList);
        const filter = [`id in (${markers.join(', ')})`];
        
        if (userRole === 'moderator') {
            filter.push(`owner_id=$${markers.length + 1}`);
            values.push(userId);
        }

        const deletedFiles = await this.delete({
            where: filter.join(' AND '),
            returning: '*',
        }, values);

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
