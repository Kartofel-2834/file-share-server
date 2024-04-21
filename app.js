// Libraries
import dotenv from 'dotenv';
import express from 'express';

// Logger
import logger from '#logger/index.js';

// Routers
import authRouter from '#routers/authRouter.js';
import usersRouter from '#routers/usersRouter.js';
import filesRouter from '#routers/filesRouter.js';
import historyRouter from '#routers/historyRouter.js';

// Middlewares
import errorsMiddleware from '#middlewares/errorsMiddleware.js';

// Database
import usersTable from '#database/tables/usersTable.js';
import filesTable from '#database/tables/filesTable.js';
import historyTable from '#database/tables/historyTable.js';

dotenv.config();

const port = process.env.SERVER_PORT || 2834;
const app = express();

app.use(express.json());
app.use(express.urlencoded({
    extended: true,
}));

// Routers use
app.use('/auth/', authRouter);
app.use('/users/', usersRouter);
app.use('/files/', filesRouter);
app.use('/history/', historyRouter);

// Middlewares
app.use(errorsMiddleware);

async function start() {
    await logger.init();

    try {
        await usersTable.init();
        await filesTable.init();
        await historyTable.init();

        app.listen(port, () => {
            logger.log(`Server start listening on port: ${port}`, 'app');
        });
    } catch (err) {
        logger.error(`Server start error. ${err}`, 'app');
    }
}

start();
