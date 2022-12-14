import * as dotenv from 'dotenv';
// read environment variables from .env file immediately so all imports have access to them
dotenv.config({ path: './.env', override: false });

import { connect } from './db/manager';
import { app } from './app';
import { logger } from './logger';
import { reservationManager } from './plan';
import { getAllActiveRequests } from './db/models/user/user.statics';

const start = async () => {
    // start app
    const port = 4001;
    await logger.log(`Starting server on port ${port}`);
    app.listen(
        port,
        async () =>
            await logger.log(
                `Express is listening at http://localhost:${port}`,
            ),
    );

    // initialize db connection manager
    await connect();

    const secondsBetweenProcessingRequests = 5;
    const loadedActiveRequests = await getAllActiveRequests();
    reservationManager.addReservationRequests(loadedActiveRequests);
    setInterval(() => {
        reservationManager.requestReservations();
    }, secondsBetweenProcessingRequests * 1000);
};

start();
