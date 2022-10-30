import express from 'express';
import { ResyKeys } from './api';
import { reservationManager } from './app';
import { updateUser } from './db/client';
import { usersCollection } from './db/manager';
import { SlotConstraints, TimeWindow } from './plan';

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

/**
 * GET /user
 * Get user info given api key
 */
router.get('/user', async (req, res) => {
    if (!req.query.user_id) {
        res.status(400).send('User id is required');
    }
});

/**
 * POST /user
 * Update a user's api key and auth token.
 * If the user doesn't exist then return an error.
 */
router.post('/user', async (req, res) => {
    const { user_id, api_key, auth_token } = req.body;

    // check that user exists
    const success = updateUser(user_id, api_key, auth_token);

    if (!success) {
        res.status(404).send('User not found');
        return;
    }

    res.send('success');
});

/**
 * POST /reserve
 * Submit a request for a reservation under supplied constraints
 */
router.post('/reserve', async (req, res) => {
    const { venue_id, user_id, slots, retry_interval_seconds, party_size } =
        req.body;
    if (
        !venue_id ||
        !user_id ||
        !slots ||
        !retry_interval_seconds ||
        !party_size
    ) {
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

    if (
        slots.some((slot) => {
            !slot.date ||
                !slot.party_size ||
                !slot.start_time ||
                !slot.end_time;
        })
    ) {
        res.status(400).send('At least one slot missing required parameters');
        return;
    }
    const windows = slots.map(
        (slot): TimeWindow => ({
            startTime: new Date(`${slot.date} ${slot.start_time}`),
            endTime: new Date(`${slot.date} ${slot.end_time}`),
        }),
    );

    const constraints: SlotConstraints = {
        partySize: party_size,
        windows,
    };

    // by default expire the request after the last window
    const expirationTime = new Date(Math.max(...windows.map((w) => w.endTime)));

    const reservationRequest = {
        venueId: venue_id,
        userId: user_id,
        constraints,
        retryIntervalSeconds: retry_interval_seconds,
        keys: {
            apiKey: keys.apiKey,
            authToken: keys.authToken,
        },
        expirationTime,
        nextRetryTime: new Date(), // try right away
    };

    reservationManager.addReservationRequest(reservationRequest);

    // return success response
    res.send({
        status: 'success',
    });
});
