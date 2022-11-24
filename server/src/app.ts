import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
import { router } from './router';
import { Logger } from './logger';
import { dbManager } from './db/manager';
import { ReservationRequestManager } from './plan';

// read environment variables from .env file
dotenv.config({ path: './.env.dev' });

// initialize server
const app = express();
const port = 4000;
const logger = new Logger();

// initialize db connection manager
dbManager.init();
app.use(cors());

// configure middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/', router);

app.listen(port, () =>
    console.log(`Express is listening at http://localhost:${port}`),
);

// data structure to manage reservation requests
const reservationManager = new ReservationRequestManager();
// await (async () => {
//     await reservationManager.loadActiveRequestsFromDb();
// })();

// run function every 5 seconds
const secondsBetweenProcessingRequests = 3;
setInterval(() => {
    reservationManager.processRequests();
}, secondsBetweenProcessingRequests * 1000);

export { reservationManager, logger };
