import express from 'express';
import axios from 'axios';
import { getSlots } from './client';
import { ResyKeys } from './api';

const app = express();
const port = 3000;

app.get('/', async (req, res) => {
    // initialize variable to 2022-10-17
    const keys: ResyKeys = {
        apiKey: 'VbWk7s3L4KiK5fzlO7JD3Q5EYolJI7n5',
        authToken:
            'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiJ9.eyJleHAiOjE2Njk3NTk1OTEsInVpZCI6MjM5MjA1ODYsImd0IjoiY29uc3VtZXIiLCJncyI6W10sImxhbmciOiJlbi11cyIsImV4dHJhIjp7Imd1ZXN0X2lkIjo5MjUzNjQxOH19.AaEf-qinrG7bU0c5jCe5wqf6fcCuaRtSVN9PEzeVGUCDPtnX4nd9V0WcrX8BL8AyybhDqpnVZOUlLN12k0n4LrE-AVPG68DeNDlvEvcDD5Qddbq_84jthOq_h0Mts4DioBDkN1_GmE-fOecL17t_L18D0qOBjJoZ21gH1DbGaY9QcPPA',
    };
    await getSlots('10191', new Date(2022, 9, 18), 2, keys);
    res.send('foo');
});

app.listen(port, () =>
    console.log(`Express is listening at http://localhost:${port}`),
);
