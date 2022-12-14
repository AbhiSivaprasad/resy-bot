import express from 'express';
import { ResyKeys } from '../external/api';
import {
    deleteReservationRequestEndpoint,
    deleteUserEndpoint,
    getAllUsersEndpoint,
    getReservationRequestsEndpoint,
    getSearchEndpoint,
    getUserEndpoint,
    postRequestReservationEndpoint,
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

/**
 * GET /allUsers
 * Get all user ids
 */
router.get('/allUsers', getAllUsersEndpoint);

/**
 * POST /search
 * @param partySize: size of party to search for (probably just set to 1 for most flexibility)
 * @param latitude: optional string user's latitude
 * @param longitude: optional string user's longitude
 * @param api_key: string
 * @param auth_token: string
 *
 * Proxy to Resy's search endpoint
 */
router.post('/search', getSearchEndpoint);

/**
 * GET /reservationRequests
 * @param user_id: string
 * Get all active requests for a user
 */
router.get('/requests', getReservationRequestsEndpoint);

/**
 * DELETE /reservation
 * @param reservation_id: string
 * Get user info given user's id
 */
router.delete('/request', deleteReservationRequestEndpoint);

/**
 * POST /reserve
 * @param venue_id: string
 * @param user_id: string
 * @param slots: SlotConstraints[]
 * @param retry_interval_seconds: number
 * @param party_size: number
 * Submit a request for a reservation under supplied constraints
 */
router.post('/requestReservation', postRequestReservationEndpoint);
