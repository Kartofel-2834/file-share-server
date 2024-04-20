// Database Managers
import QueryManager from '#database/queryManager.js';

export const schema = {
    id: 'SERIAL PRIMARY KEY',
    login: 'VARCHAR(255) NOT NULL',
    password: 'VARCHAR(255) NOT NULL',
    email: 'VARCHAR(255)',
    email_code: 'VARCHAR(255)',
    role: 'VARCHAR(255) DEFAULT \'user\'',
    name: 'VARCHAR(255)',
    surname: 'VARCHAR(255)', 
};

export default new QueryManager('users', schema);
