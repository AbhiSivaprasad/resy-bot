import { ResyKeys } from './api';
import { getSlots, reserveSlot, Slot } from './client';

export class ReservationManager {
    private requests: ReservationRequest[] = [];
    constructor(requests?: ReservationRequest[]) {
        this.requests = requests;
    }

    public addReservationRequest(request: ReservationRequest) {
        this.requests.push(request);
    }

    public processRequests() {
        // iterate in reverse to enable safe deletion of finished requests
        for (let i = this.requests.length - 1; i >= 0; i--) {
            const request = this.requests[i];
            if (this.requestStillValid(request)) {
                // only try to reserve if it's been sufficiently long since the last attempt
                if (request.nextRetryTime.valueOf() <= new Date().valueOf()) {
                    const reservationSuccessful = this.processRequest(request);
                    if (reservationSuccessful) {
                        // remove request if the reservation was successful
                        this.requests.splice(i, 1);
                    } else {
                        // if the reservation was not successful, schedule a retry
                        request.nextRetryTime = new Date();
                        request.nextRetryTime.setSeconds(
                            request.nextRetryTime.getSeconds() +
                                request.retryIntervalSeconds,
                        );
                    }
                }
            } else {
                // remove request if reservation was unsuccessful but expriation time has passed
                this.requests.splice(i, 1);
            }
        }
    }

    private async processRequest(request: ReservationRequest) {
        const slotToReserve = await findSuitableReservation(
            request.venueId,
            request.constraints,
            request.keys,
        );

        if (slotToReserve) {
            const response = await reserveSlot(slotToReserve, request.keys);
            if (response.success) {
                console.log('Successfully reserved slot');
                return true;
            }
        }

        return false;
    }

    private requestStillValid(request: ReservationRequest) {
        return request.expirationTime.valueOf() >= new Date().valueOf();
    }
}

export const findSuitableReservation = async (
    venueId: string,
    constraints: SlotConstraints,
    keys: ResyKeys,
): Promise<Slot | undefined> => {
    // find all unique dates we need to check for available reservations
    // remove dates in the past (we may have been trying to snipe for multiple days)
    const allowedDates = [
        ...new Set(
            constraints.windows.map((window) =>
                window.startTime.toISOString().substring(0, 10),
            ),
        ),
    ].map((date) => new Date(date));

    // return the first slot that meets the constraints to minimize api calls
    let slotToReserve = undefined;
    for (const date of allowedDates) {
        const slots = await getSlots(
            venueId,
            date,
            constraints.partySize,
            keys,
        );
        const suitableSlots = slots.filter((slot) =>
            doesSlotMeetConstraints(slot, constraints),
        );
        if (suitableSlots.length > 0) {
            slotToReserve = suitableSlots[0];
            break;
        }
    }

    return slotToReserve;
};

const doesSlotMeetConstraints = (
    slot: Slot,
    constraints: SlotConstraints,
): boolean => {
    const slotIsInWindow = constraints.windows.some(
        (window) =>
            slot.startTime >= window.startTime &&
            slot.startTime <= window.endTime,
    );
    const slotIsRightSize = slot.size == constraints.partySize;
    return slotIsInWindow && slotIsRightSize;
};

export type ReservationRequest = {
    userId: string;
    venueId: string;
    keys: ResyKeys;
    constraints: SlotConstraints;
    expirationTime: Date;
    retryIntervalSeconds: number;
    nextRetryTime: Date;
};

export type SlotConstraints = {
    windows: TimeWindow[];
    partySize: number;
};

export type TimeWindow = {
    startTime: Date;
    endTime: Date;
};
