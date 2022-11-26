import { Err } from 'ts-results';
import { reservationManager } from './app';
import {
    getUser,
    getUserActiveReservationCount,
    insertUserReservations,
} from './db/client';
import {
    Reservation,
    ReservationRequest,
    SlotConstraints,
    TimeWindow,
    User,
} from './db/types';
import { ResyKeys } from './external/api';

export const reserve = async (
    venue_ids,
    user_id,
    retry_interval_seconds,
    slots,
    party_size,
    keys: ResyKeys,
) => {
    // check that the user has permission to do this
    const user = await getUser(user_id);
    if (user.err) {
        return user;
    }

    const existingReservationCount = await getUserActiveReservationCount(
        user_id,
    );
    if (
        existingReservationCount + venue_ids.length >
        (user.val as User).concurrentLimit
    ) {
        return Err('USER_LIMIT_EXCEEDED');
    }

    const windows = slots.map(
        (slot): TimeWindow => ({
            startTime: new Date(`${slot.date}T${slot.start_time}`),
            endTime: new Date(`${slot.date}T${slot.end_time}`),
        }),
    );

    const constraints: SlotConstraints = {
        partySize: party_size,
        windows,
    };

    console.log(
        'end time is',
        slots[0].date,
        slots[0].end_time,
        windows[0].endTime,
    );
    // by   fault expire the request after the last window
    const expirationTime = new Date(Math.max(...windows.map((w) => w.endTime)));

    const reservationRequests: ReservationRequest[] = venue_ids.map(
        (venue_id) => ({
            venueIds: venue_id,
            userId: user_id,
            constraints,
            retryIntervalSeconds: retry_interval_seconds,
            keys: {
                apiKey: keys.apiKey,
                authToken: keys.authToken,
            },
            expirationTime,
            nextRetryTime: new Date(), // try right away
        }),
    );

    // commit reservations to db
    await insertUserReservations(reservationRequests as Reservation[]);

    // add to in memory queue
    reservationManager.addReservationRequests(reservationRequests);
};
