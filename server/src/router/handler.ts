import { Err, Ok } from 'ts-results';
import { UserModel } from '../db/models/user/user.model';
import {
    addReservationRequestForUser,
    deleteReservationRequestForUser,
    getActiveRequestCountForUser,
} from '../db/models/user/user.statics';
import { ITimeWindow, IUserDocument } from '../db/models/user/user.types';
import { search } from '../external/api';
import { GeoLocation } from '../external/types';
import { reservationManager } from '../main';

export async function getUser(username: string) {
    const user: IUserDocument = await UserModel.findOne({ username: username });
    return (
        user && {
            user_id: user.username,
            concurrentLimit: user.concurrentLimit,
            keys: user.keys,
        }
    );
}

export async function postUser(username: string, concurrentLimit: string) {
    try {
        const user = await UserModel.create({
            username: username,
            concurrentLimit: concurrentLimit,
        });

        return {
            user_id: user.username,
            concurrentLimit: user.concurrentLimit,
            keys: user.keys,
        };
    } catch {
        return null;
    }
}

export async function putUser(
    username: string,
    apiKey: string,
    authToken: string,
) {
    const result = await UserModel.updateOne(
        { username: username },
        { keys: { apiKey: apiKey, authToken: authToken } },
    );

    return result.matchedCount != 0;
}

export async function deleteUser(username: string) {
    const result = await UserModel.deleteOne({ username: username });

    return result.deletedCount != 0;
}

export async function getAllUsers() {
    const users = await UserModel.find({}).select('username');
    const userIds = users.map((user) => user.username);
    return userIds;
}

export async function getSearch(
    party_size: number,
    latitude: string,
    longitude: string,
    api_key: string,
    auth_token: string,
    query: string,
) {
    const location: GeoLocation =
        latitude && longitude ? { latitude, longitude } : undefined;

    return await search(
        party_size,
        { apiKey: api_key, authToken: auth_token },
        query,
        location,
    );
}

export async function getReservationRequests(username: string) {
    const user = await UserModel.findOne({ username: username }).select(
        'reservationRequests',
    );
    return user.reservationRequests;
}

export async function deleteReservationRequest(
    username: string,
    reservationId: string,
) {
    return await deleteReservationRequestForUser(username, reservationId);
}

export async function postRequestReservation(
    username,
    venueId,
    retryIntervalSeconds,
    timeWindows: ITimeWindow[],
    partySizes: number[],
) {
    const user = await UserModel.findOne({ username });

    // set expiration time of request 1 month in the future
    const expirationTime = new Date();
    expirationTime.setDate(expirationTime.getDate() + 90);

    // verify the user is within rate limit
    const numActiveRequestsForUser = await getActiveRequestCountForUser(
        username,
    );
    if (numActiveRequestsForUser < user.concurrentLimit) {
        return Err(
            `User is at the concurrent request limit of ${numActiveRequestsForUser}`,
        );
    }

    // save the user's request
    const reservationRequest = {
        venueId,
        expirationTime,
        retryIntervalSeconds,
        timeWindows,
        partySizes,
        complete: false,
    };
    await addReservationRequestForUser(username, reservationRequest);

    // start the request
    // add keys
    // add next retry time?
    const activeReservationRequest = {
        ...reservationRequest,
        keys: user.keys,
        nextRetryTime: new Date(),
        userId: user.username,
    };
    reservationManager.addReservationRequest(activeReservationRequest);

    return Ok(null);
}
