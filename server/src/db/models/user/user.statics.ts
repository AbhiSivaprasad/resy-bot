import { UserModel } from './user.model';
import { IReservationRequest } from './user.types';

export async function getActiveRequestCountForUser(username: string) {
    const user = await UserModel.findOne({ username: username });

    return user.reservationRequests.filter(
        (request) => request.expirationTime > new Date(),
    ).length;
}

export async function getAllActiveRequests() {
    const users = await UserModel.find();

    return users
        .map((user) =>
            user
                .toObject()
                .reservationRequests.filter(
                    (request) =>
                        request.expirationTime > new Date() &&
                        !request.bookedSlot,
                )
                .map((request) => ({
                    ...request,
                    keys: user.keys,
                    nextRetryTime: new Date(),
                    userId: user.username,
                })),
        )
        .flat(1);
}

export async function addReservationRequestForUser(
    username: string,
    request: IReservationRequest,
) {
    const user = await UserModel.findOneAndUpdate(
        { username },
        {
            $push: {
                reservationRequests: request,
            },
        },
        { new: true },
    );

    // last added reservation request
    return user.toObject().reservationRequests[
        user.reservationRequests.length - 1
    ];
}

export async function deleteReservationRequestForUser(
    username: string,
    reservationId: string,
) {
    const result = await UserModel.updateOne(
        { username },
        { $pull: { reservationRequests: { _id: reservationId } } },
    );

    return result.modifiedCount != 0;
}
