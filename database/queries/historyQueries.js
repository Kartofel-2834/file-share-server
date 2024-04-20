// Database Managers
import QueryManager from '#database/queryManager.js';

export const schema = {
    id: 'SERIAL PRIMARY KEY',
    type: 'VARCHAR(255) NOT NULL DEFAULT \'upload\'',
    date: 'TIMESTAMP NOT NULL DEFAULT NOW()',
    user_id: 'INTEGER',
    file_id: 'INTEGER',
};

const foreignKeys = {
    user_id: {
        reference: 'users(id)',
        action: 'ON DELETE SET NULL',
    },

    file_id: {
        reference: 'files(id)',
        action: 'ON DELETE SET NULL',
    },
};

export default new QueryManager('history', schema, foreignKeys);
