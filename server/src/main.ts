import * as dotenv from 'dotenv';
import { ReservationRequestManager } from './plan';
import { connect } from './db/manager';
import { app } from './app';

// read environment variables from .env file
dotenv.config({ path: './.env.dev' });

// start app
const port = 4001;
app.listen(port, () =>
    console.log(`Express is listening at http://localhost:${port}`),
);

// initialize db connection manager
(async () => {
    await connect();
})();

// data structure to manage reservation requests
const reservationManager = new ReservationRequestManager();
// await (async () => {
//     await reservationManager.loadActiveRequestsFromDb();
// })();

const secondsBetweenProcessingRequests = 3;
setInterval(() => {
    reservationManager.processRequests();
}, secondsBetweenProcessingRequests * 1000);

// TODO: think about whether main should export this
export { reservationManager };
