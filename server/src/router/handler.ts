import { Err, Ok } from 'ts-results';
import { UserModel } from '../db/models/user/user.model';
import {
    addReservationRequestForUser,
    deleteReservationRequestForUser,
    getActiveRequestCountForUser,
} from '../db/models/user/user.statics';
import {
    ITimeWindow,
    IUserDocument,
    IVenue,
} from '../db/models/user/user.types';
import { search } from '../external/api';
import { GeoLocation } from '../external/types';
import { reservationManager } from '../plan';

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
    username: string,
    partySize: number,
    query: string,
    location?: GeoLocation,
) {
    const user = await UserModel.findOne({ username: username }).select('keys');
    if (!user) {
        return Err('USER_NOT_FOUND');
    }
    const keys = user.keys;
    const response = await search(partySize, keys, query, location);
    return response;
}

export async function postValidateKeys(apiKey: string, authToken: string) {
    // validate keys by making a search request
    const response = await search(2, { apiKey, authToken }, 'ba');
    return !response.err;
}

export async function getReservationRequests(username: string) {
    const user = await UserModel.findOne({ username: username }).select(
        'reservationRequests',
    );
    if (!user) {
        return Err('USER_NOT_FOUND');
    }
    return Ok(user.reservationRequests || []);
}

export async function deleteReservationRequest(
    username: string,
    reservationId: string,
) {
    reservationManager.removeReservationRequest(reservationId);
    return await deleteReservationRequestForUser(username, reservationId);
}

export async function postRequestReservation(
    username,
    venues: IVenue[],
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
    if (numActiveRequestsForUser >= user.concurrentLimit) {
        return Err(
            `User is at the concurrent request limit of ${numActiveRequestsForUser}`,
        );
    }

    // save the user's request
    const reservationRequest = {
        venues,
        expirationTime,
        retryIntervalSeconds,
        timeWindows,
        partySizes,
    };
    const savedReservationRequest = await addReservationRequestForUser(
        username,
        reservationRequest,
    );

    // start the request
    const activeReservationRequest = {
        ...savedReservationRequest,
        keys: user.keys,
        nextRetryTime: new Date(),
        userId: user.username,
    };
    reservationManager.addReservationRequest(activeReservationRequest);

    return Ok(null);
}
