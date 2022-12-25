import * as dotenv from 'dotenv';
import { connect } from './db/manager';
import { app } from './app';
import { logger } from './logger';
import { reservationManager } from './plan';

// read environment variables from .env file
dotenv.config({ path: './.env.dev' });

// await (async () => {
//     await reservationManager.loadActiveRequestsFromDb();
// })();

// start app
const port = 4001;
logger.log(`Starting server on port ${port}`);
app.listen(port, () =>
    console.log(`Express is listening at http://localhost:${port}`),
);

// initialize db connection manager
(async () => {
    await connect();
})();

const secondsBetweenProcessingRequests = 3;
setInterval(() => {
    reservationManager.requestReservations();
}, secondsBetweenProcessingRequests * 1000);
