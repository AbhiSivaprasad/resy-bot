import express from 'express';
import axios from 'axios';
import { getVenueDetails } from './api';

const app = express();
const port = 3000;

app.get('/', async (req, res) => {
    res.send("foo");
});

app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
});