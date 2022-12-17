import express from 'express';
import {
    deleteReservationRequestEndpoint,
    deleteUserEndpoint,
    getAllUsersEndpoint,
    getReservationRequestsEndpoint,
    getSearchEndpoint,
    getUserEndpoint,
    postReservationRequestEndpoint,
    postUserEndpoint,
    putUserEndpoint,
} from './endpoints';

export const router = express.Router();

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
router.get('/reservationRequests', getReservationRequestsEndpoint);

/**
 * DELETE /reservation
 * @param reservation_id: string
 * Get user info given user's id
 */
router.delete('/reservationRequest', deleteReservationRequestEndpoint);

/**
 * POST /reserve
 * @param user_id: string
 * @param venue_id: string
 * @param venueMetadata: any
 * @param timeWindows: ITimeWindow[]
 * @param partySizes: number[]
 * @param retryIntervalSeconds: number
 * Submit a request for a reservation under supplied constraints
 */
router.post('/reservationRequest', postReservationRequestEndpoint);
