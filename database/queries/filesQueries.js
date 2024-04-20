// Database Managers
import QueryManager from '#database/queryManager.js';

export const schema = {
    id: 'SERIAL PRIMARY KEY',
    name: 'VARCHAR(255) NOT NULL',
    created_at: 'TIMESTAMP NOT NULL DEFAULT NOW()',
    size: 'INTEGER',
    extenstion: 'VARCHAR(255)',
    owner_id: 'INTEGER',
};

const foreignKeys = {
    owner_id: {
        reference: 'users(id)',
        action: 'ON DELETE SET NULL',
    },
};

export default new QueryManager('files', schema, foreignKeys);
