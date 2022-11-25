import { ObjectID } from 'bson';
import { Ok, Err, Result } from 'ts-results';
import { RESERVATION_COLLECTION_NAME } from './constants';
import { reservationsCollection, usersCollection } from './manager';
import { Reservation, ReservationRequest, User } from './types';

type UpdateUserErrors = 'USER_NOT_FOUND';
type GetUserErrors = 'USER_NOT_FOUND';
type DeleteReservationErrors = 'RESERVATION_NOT_FOUND';

export const updateUser = async (
    userId: string,
    api_key: string,
    auth_token: string,
): Promise<Result<ObjectID, UpdateUserErrors>> => {
    const user = await (await usersCollection()).findOne({ userId: userId });

    if (!user) {
        return Err('USER_NOT_FOUND');
    }
    await (
        await usersCollection()
    ).updateOne(
        { _id: user._id },
        {
            $set: {
                api_key: api_key,
                auth_token: auth_token,
            },
        },
    );

    return Ok(user._id);
};

export const getUser = async (
    userId: string,
): Promise<Result<User, GetUserErrors>> => {
    const user = <User>(
        await (await usersCollection()).findOne({ userId: userId })
    );

    if (!user) {
        return Err('USER_NOT_FOUND');
    }

    return Ok(user);
};

export const getUserActiveReservationCount = async (
    userId: string,
): Promise<number> => {
    const reservationCount = await (
        await reservationsCollection()
    ).countDocuments({ userId: userId, expirationTime: { $gt: new Date() } });

    return reservationCount;
};

export const getUserActiveReservations = async (
    userId: string,
): Promise<ReservationRequest[]> => {
    const reservations = (await (await reservationsCollection())
        .find({ userId: userId, expirationTime: { $gt: new Date() } })
        .toArray()) as ReservationRequest[];

    return reservations;
};

export const deleteReservation = async (
    reservationId: string,
): Promise<void> => {
    const deleted = await (
        await reservationsCollection()
    ).deleteOne({ _id: reservationId });
};

export const insertUserReservations = async (
    reservations: Reservation[],
): Promise<void> => {
    await (await reservationsCollection()).insertMany(reservations);
};

export const getActiveReservations = async (): Promise<
    ReservationRequest[]
> => {
    const reservations = (await (
        await reservationsCollection()
    )
        .aggregate([
            { $match: { expirationTime: { $gt: new Date() } } },
            {
                $lookup: {
                    from: RESERVATION_COLLECTION_NAME,
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user',
                },
            },
        ])
        .toArray()) as ReservationRequest[];

    return reservations;
};
