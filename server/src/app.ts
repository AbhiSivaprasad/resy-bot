import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

// export app early so dependencies can import it
const app = express();
export { app };

import { router } from './router/router';

// configure middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/', router);

if (process.env.NODE_ENV !== 'development') {
    app.use('/', express.static('../client/build'));
    // match all routes and serve index.html
    app.get('*', (req, res) => {
        res.sendFile('index.html', { root: '../client/build' });
    });
}
