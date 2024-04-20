// Libraries
import dotenv from 'dotenv';
import express from 'express';

// Logger
import logger from '#logger/index.cjs';

// Routers
import authRouter from '#routers/authRouter.js';
import usersRouter from '#routers/usersRouter.js';

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

// Routers
app.use('/auth/', authRouter);
app.use('/users/', usersRouter);

app.post('/', (req, res) => {
    console.log(req.body);

    res.status(200).send('kamal');
});

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
