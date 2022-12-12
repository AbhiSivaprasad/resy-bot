import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
import { router } from './router/router';

// read environment variables from .env file
dotenv.config({ path: './.env.dev' });

// initialize server
const app = express();

// configure middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/', router);

export { app };
