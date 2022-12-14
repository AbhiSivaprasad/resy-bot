import { UserModel } from './user.model';
import { IReservationRequest } from './user.types';

export async function getActiveRequestCountForUser(username: string) {
    const user = await UserModel.findOne({ username: username });

    return user.reservationRequests.filter(
        (request) => request.expirationTime > new Date(),
    ).length;
}

export async function getAllActiveRequests() {
    const users = await UserModel.find().select('reservationRequests');

    return users.map((user) => ({
        requests: user.reservationRequests.filter(
            (request) => request.expirationTime > new Date(),
        ),
    }));
}

export async function addReservationRequestForUser(
    username: string,
    request: IReservationRequest,
) {
    await UserModel.updateOne(
        { username },
        {
            $push: {
                reservationRequests: request,
            },
        },
    );
}

export async function deleteReservationRequestForUser(
    username: string,
    reservationId: string,
) {
    const result = await UserModel.updateOne(
        { username, 'reservationRequests.id': reservationId },
        { $pull: { reservationRequests: { id: reservationId } } },
    );

    return result.matchedCount != 0;
}
