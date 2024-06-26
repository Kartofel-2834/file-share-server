// Database Queries
import filesQueries from '#database/queries/filesQueries.js';

// Database Managers
import TableManager from '#database/tableManager.js';

// Logger
import logger from '#logger/index.js';

// Database
import db from '#database/db.js';

// Utils
import { getValuesMarkers, convertQueryParts } from '#utils/dbUtils.js';

const validateRules = {
    name: ['required'],
};

class FilesTableManager extends TableManager {
    constructor() {
        super('files', filesQueries, validateRules);
    }

    async getFileById(id) {
        const result = await this.getFiles({ where: 'files.id=$1' }, [id]);
        return result?.[0] ?? null;
    }

    // TODO: зарефакторить менеджеры таблиц и квери так, чтобы можно было делать их более кастомными
    async getFiles(filters, values) {
        const onError = this._queryCheck('select', 'file select failed', 'select');

        const targets = [
            'distinct on(files.id) files.*',
            'users.name as owner_name',
            'users.surname as owner_surname',
            'CASE WHEN h_view.type IS NOT NULL THEN true ELSE false END as is_viewed',
            'CASE WHEN h_download.type IS NOT NULL THEN true ELSE false END as is_downloaded',
        ];

        const query = {
            'left join': 'history h_view ON h_view.file_id = files.id AND h_view.type = \'view\'',
            'LEFT JOIN': 'history h_download ON h_download.file_id = files.id AND h_download.type = \'download\'',
            join: 'users on files.owner_id=users.id',
        };

        try {
            const withCommand = this.$query.select(targets.join(', '), query);
            const filtersQuery = convertQueryParts(filters || {});
            const command = `WITH result as (${withCommand}) SELECT * FROM result ${filtersQuery}`;

            const result = await db.query(command, values || []);
            
            return Array.isArray(result?.rows) ? result.rows : [];
        } catch (err) {
            onError(err);
            throw err;
        }
    }

    async createFile(payload) {
        const result = await this.add(payload);
        
        if (!result?.errors) {
            logger.log(`File ${payload?.name} created`, 'filesTable/createFile');
        }

        return result;
    }

    async deleteFiles(filesIdsList = [], ownerId = null) {
        const values = [...filesIdsList];
        const markers = getValuesMarkers(filesIdsList);
        const filter = [`id in (${markers.join(', ')})`];

        if (ownerId) {
            filter.push(`owner_id=$${markers.length + 1}`);
            values.push(ownerId);
        }

        const deletedFiles = await this.delete({
            where: filter.join(' AND '),
            returning: '*',
        }, values);

        if (Array.isArray(deletedFiles)) {
            for (const file of deletedFiles) {
                logger.log(`deleted file ${file?.name}`, 'filesTable/deleteFiles');
            }
        }

        return deletedFiles;
    }
}

export default new FilesTableManager();
