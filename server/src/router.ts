import express from 'express';
import { ResyKeys } from './api';

export const router = express.Router();

const keys: ResyKeys = {
    apiKey: 'VbWk7s3L4KiK5fzlO7JD3Q5EYolJI7n5',
    authToken:
        'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiJ9.eyJleHAiOjE2Njk3NTk1OTEsInVpZCI6MjM5MjA1ODYsImd0IjoiY29uc3VtZXIiLCJncyI6W10sImxhbmciOiJlbi11cyIsImV4dHJhIjp7Imd1ZXN0X2lkIjo5MjUzNjQxOH19.AaEf-qinrG7bU0c5jCe5wqf6fcCuaRtSVN9PEzeVGUCDPtnX4nd9V0WcrX8BL8AyybhDqpnVZOUlLN12k0n4LrE-AVPG68DeNDlvEvcDD5Qddbq_84jthOq_h0Mts4DioBDkN1_GmE-fOecL17t_L18D0qOBjJoZ21gH1DbGaY9QcPPA',
};

// add router in the Express app.
router.get('/', async (req, res) => {
    res.send('foo');
});

router.post('/user', async (req, res) => {
    const { user_id, api_key, auth_token } = req.body;

    // update api key and auth token in db
    res.send('test');
});

router.post('/reserve', async (req, res) => {
    const { venue_id, user_id, slots, retry_interval_seconds } = req.body;
    if (!venue_id || !user_id || !slots || !retry_interval_seconds) {
        res.status(400).send('Missing required parameters');
        return;
    } else if (slots.length === 0) {
        res.status(400).send('No slots provided');
        return;
    } else if (
        !Number.isFinite(retry_interval_seconds) ||
        !Number.isInteger(retry_interval_seconds) ||
        retry_interval_seconds < 1
    ) {
        res.status(400).send('Retry interval must be an integer > 1');
        return;
    }
    res.send('bar');
});
