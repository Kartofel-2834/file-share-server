// Libraries
import pg from 'pg';
import dotenv from 'dotenv';

// Logger
import logger from '#logger/index.js';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE_NAME,
});

pool.on('error', err => {
    logger.error(`database pool error: ${err}`, 'db');
});

export default pool;
