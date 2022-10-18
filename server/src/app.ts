import express from 'express';
import bodyParser from 'body-parser';
import { router } from './router';
import { ReservationManager } from './plan';
import { Logger } from './logger';

const app = express();
const port = 3000;
const logger = new Logger();

// configure middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/', router);

app.listen(port, () =>
    console.log(`Express is listening at http://localhost:${port}`),
);

// data structure to manage reservation requests
const reservationManager = new ReservationManager();

// run function every 5 seconds
const secondsBetweenProcessingRequests = 3;
setInterval(() => {
    reservationManager.processRequests();
}, secondsBetweenProcessingRequests * 1000);

export { reservationManager, logger };
