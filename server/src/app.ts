import express from 'express';
import bodyParser from 'body-parser';
import { router } from './router';

const app = express();
const port = 3000;

// configure middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/', router);

app.listen(port, () =>
    console.log(`Express is listening at http://localhost:${port}`),
);
