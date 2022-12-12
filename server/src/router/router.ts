import express from 'express';
import { ResyKeys } from '../external/api';
import {
    deleteUserEndpoint,
    getUserEndpoint,
    postUserEndpoint,
    putUserEndpoint,
} from './endpoints';

export const router = express.Router();

const keys: ResyKeys = {
    apiKey: 'VbWk7s3L4KiK5fzlO7JD3Q5EYolJI7n5',
    authToken:
        'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiJ9.eyJleHAiOjE2Njk3NTk1OTEsInVpZCI6MjM5MjA1ODYsImd0IjoiY29uc3VtZXIiLCJncyI6W10sImxhbmciOiJlbi11cyIsImV4dHJhIjp7Imd1ZXN0X2lkIjo5MjUzNjQxOH19.AaEf-qinrG7bU0c5jCe5wqf6fcCuaRtSVN9PEzeVGUCDPtnX4nd9V0WcrX8BL8AyybhDqpnVZOUlLN12k0n4LrE-AVPG68DeNDlvEvcDD5Qddbq_84jthOq_h0Mts4DioBDkN1_GmE-fOecL17t_L18D0qOBjJoZ21gH1DbGaY9QcPPA',
};

// add router in the Express app.
/**
 * GET /user
 * @param user_id: string
 * Get user info given user's id
 */
router.get('/user', getUserEndpoint);

/**
 * POST /user
 * @param user_id: string
 * @param concurrentLimit: number
 * Create a user, for usage only by admins
 * If the user doesn't exist then return an error.
 */
router.post('/user', postUserEndpoint);

/**
 * PUT /user
 * @param user_id: string
 * @param api_key: string
 * @param auth_token: string
 * Update a user's api key and auth token.
 * If the user doesn't exist then return an error.
 */
router.put('/user', putUserEndpoint);

/**
 * DELETE /user
 * @param user_id: string
 * delete a user by their user id
 * If the user doesn't exist then return an error.
 */
router.delete('/user', deleteUserEndpoint);

// /**
// * POST /search
// * @param partySize: size of party to search for (probably just set to 1 for most flexibility)
// * @param latitude: optional string user's latitude
// * @param longitude: optional string user's longitude
// * @param api_key: string
// * @param auth_token: string
// *
// * Proxy to Resy's search endpoint
// */
// router.post('/search', async (req, res) => {
// const { party_size, latitude, longitude, api_key, auth_token, query } =
// req.body;

// if (!api_key || !auth_token || !party_size) {
// res.status(400).send('party_size, api_key, auth_token are required');
// return;
// }

// const location: GeoLocation =
// latitude && longitude ? { latitude, longitude } : undefined;

// const searchResults = await search(
// parseInt(party_size),
// { apiKey: api_key, authToken: auth_token },
// query,
// location,
// );

// res.send(searchResults);
// });

// /**
// * POST /reserve
// * @param venue_id: string
// * @param user_id: string
// * @param slots: SlotConstraints[]
// * @param retry_interval_seconds: number
// * @param party_size: number
// * Submit a request for a reservation under supplied constraints
// */
// router.post('/reserve', async (req, res) => {
// const { venue_ids, user_id, slots, retry_interval_seconds, party_size } =
// req.body;
// if (
// !venue_ids ||
// !user_id ||
// !slots ||
// !retry_interval_seconds ||
// !party_size
// ) {
// res.status(400).send('Missing required parameters');
// return;
// } else if (slots.length === 0) {
// res.status(400).send('No slots provided');
// return;
// } else if (venue_ids.length === 0) {
// res.status(400).send('No venues provided');
// return;
// } else if (
// !Number.isFinite(retry_interval_seconds) ||
// !Number.isInteger(retry_interval_seconds) ||
// retry_interval_seconds < 1
// ) {
// res.status(400).send('Retry interval must be an integer > 1');
// return;
// }

// if (
// slots.some((slot) => {
// !slot.date ||
// !slot.party_size ||
// !slot.start_time ||
// !slot.end_time;
// })
// ) {
// res.status(400).send('At least one slot missing required parameters');
// return;
// }

// const result = await reserve(
// venue_ids,
// user_id,
// retry_interval_seconds,
// slots,
// party_size,
// keys,
// );

// // return success response
// res.send({
// status: 'success',
// });
// });

// /**
// * GET /requests
// * @param user_id: string
// * Get all active requests for a user
// */
// router.get('/requests', async (req, res) => {
// if (!req.query.user_id) {
// res.status(400).send('User id is required');
// return;
// }

// const result = await getUserActiveReservations(req.query.user_id as string);
// if (result.err) {
// const error = result.val;
// switch (error) {
// case 'USER_NOT_FOUND':
// res.status(404).send('User not found');
// return;
// default:
// throw new UnreachableCaseError(error);
// }
// } else {
// res.send(result.val);
// }
// });

// /**
// * DELETE /reservation
// * @param user_id: string
// * Get user info given user's id
// */
// router.delete('/request', async (req, res) => {
// if (!req.query.reservation_id) {
// res.status(400).send('Reservation id is required');
// return;
// }
// const result = await deleteReservation(req.query.reservation_id as string);
// console.log(
// 'result is',
// result,
// 'reservation is is',
// req.query.reservation_id,
// );
// res.send('success');
// });
