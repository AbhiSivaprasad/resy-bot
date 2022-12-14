import { UserModel } from '../db/models/user/user.model';
import { IUserDocument } from '../db/models/user/user.types';
import { search } from '../external/api';
import { GeoLocation } from '../external/types';

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
    const users = await UserModel.find({});
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
